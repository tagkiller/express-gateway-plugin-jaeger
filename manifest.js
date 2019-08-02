// @ts-check
/// <reference path="./node_modules/express-gateway/index.d.ts" />
const opentracing = require('opentracing');
const initTracer = require('jaeger-client').initTracer;
const PrometheusMetricsFactory = require('jaeger-client').PrometheusMetricsFactory;
const promClient = require('prom-client');

const plugin = {
  version: '1.0.0',
  policies: ['jaeger'],

  init: pluginContext => {
    pluginContext.registerPolicy({
      name: 'jaeger',
      schema: {
        $id: 'http://express-gateway.io/schemas/policies/jaeger.json',
        type: 'object',
        properties: {
          serviceName: {
            type: 'string',
            description: 'The service name',
          },
          disable: {
            type: 'boolean',
            description: 'Whether the tracer is disabled or not. If true, the default opentracing.NoopTracer is used.',
          },
          sampler: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                description: 'The sampler type',
              },
              param: {
                type: 'number',
                description: 'The sampler parameter (number)',
              },
              hostPort: { type: 'string' },
              host: {
                type: 'string',
                description: 'The HTTP endpoint when using the remote sampler, i.e. http://jaeger-agent:5778/sampling'
              },
              port: {
                type: 'number',
                description: 'The http port'
              },
              refreshIntervalMs: {
                type: 'number',
                description: 'How often the remotely controlled sampler will poll jaeger-agent for the appropriate sampling strategy'
              },
            },
            required: ['type', 'param'],
          },
          reporter: {
            type: 'object',
            properties: {
              logSpans: {
                type: 'boolean',
                description: 'Whether the reporter should also log the spans'
              },
              agentHost: {
                type: 'string',
                description: 'The hostname for communicating with agent via UDP',
              },
              agentPort: {
                type: 'number',
                description: 'The port for communicating with agent via UDP',
              },
              collectorEndpoint: {
                type: 'string',
                description: 'Provide the traces endpoint; this forces the client to connect directly to the Collector and send spans over HTTP'
              },
              username: {
                type: 'string',
                description: 'Username to send as part of "Basic" authentication to the collector endpoint',
              },
              password: {
                type: 'string',
                description: 'Password to send as part of "Basic" authentication to the collector endpoint'
              },
              flushIntervalMs: {
                type: 'number',
                description: 'The reporter\'s flush interval (ms)'
              },
            },
          },
          throttler: {
            properties: {
              host: { type: 'string' },
              port: { type: 'number' },
              refreshIntervalMs: { type: 'number' },
            },
          },
          tags: {
            type: 'string',
            description: 'A comma separated list of name = value tracer level tags, which get added to all reported spans. The value can also refer to an environment variable using the format ${envVarName:default}, where the :default is optional, and identifies a value to be used if the environment variable cannot be found'
          },
        },
        required: ['serviceName'],
      },
      policy: (actionParams) => {
        const { tags, logger } = actionParams;
        const metrics = new PrometheusMetricsFactory(promClient, actionParams.serviceName);
        const tracer = initTracer(actionParams, {tags, metrics, logger});
        console.log('-------- Tracer created', actionParams, tags, metrics, logger);
        return (req, res, next) => {
          const span = tracer.startSpan(`${req.protocol}_request`);
          // Look at the following doc for the list of events : https://nodejs.org/api/http.html
          console.log('-------- span', res);

          res.on('error', err => {
            span.setTag(opentracing.Tags.ERROR, true);
            span.log({'event': 'error', 'error.object': err, 'message': err.message, 'stack': err.stack});
            span.finish();
          });
          res.on('data', chunk => {
            span.log({'event': 'data_received', 'chunk_length': chunk.length});
          });
          res.on('end', () => {
            span.log({'event': 'request_end'});
            span.finish();
            console.log(res);
          });
          next();
        }
      },
    });

  }
};

module.exports = plugin;
