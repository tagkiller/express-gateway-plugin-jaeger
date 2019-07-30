// @ts-check
/// <reference path="./node_modules/express-gateway/index.d.ts" />

const plugin = {
  version: '1.0.0',
  policies: ['jaeger'],
  init: function (pluginContext) {
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
              type: { type: 'string' },
              param: { type: 'number' },
              hostPort: { type: 'string' },
              host: {
                type: 'string',
                description: 'The HTTP endpoint when using the remote sampler, i.e. http://jaeger-agent:5778/sampling'
              },
              port: {
                type: 'number',
                description: 'How often the remotely controlled sampler will poll jaeger-agent for the appropriate sampling strategy'
              },
              refreshIntervalMs: { type: 'number' },
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
              },
              agentPort: { type: 'number' },
              collectorEndpoint: { type: 'string' },
              username: { type: 'string' },
              password: { type: 'string' },
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
          agentHost: {
            type: 'string',
            description: 'The hostname for communicating with agent via UDP'
          },
          agentPort: {
            type: 'integer',
            description: 'The port for communicating with agent via UDP'
          },
          endpoint: {
            type: 'string',

          },
          user: {
            type: 'string',
            description: 'Username to send as part of "Basic" authentication to the collector endpoint'
          },
          password: {
            type: 'string',
            description: 'Password to send as part of "Basic" authentication to the collector endpoint'
          },
          reporterLogSpans: {
            type: 'string',

          },
          reporterFlushInterval: {
            type: 'string',

          },
          samplerType: {
            type: 'string',
            description: 'The sampler type'
          },
          samplerParam: {
            type: 'string',
            description: 'The sampler parameter (number)'
          },
          samplerManagerHostPort: {
            type: 'string',

          },
          samplerRefreshInterval: {
            type: 'string',

          },
          tags: {
            type: 'string',
            description: 'A comma separated list of name = value tracer level tags, which get added to all reported spans. The value can also refer to an environment variable using the format ${envVarName:default}, where the :default is optional, and identifies a value to be used if the environment variable cannot be found'
          },
        }
      },
      policy: (actionParams) => {

      }

    });
    pluginContext.registerCondition({});

  }
};

module.exports = plugin;
