#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');

// Простой MCP сервер для управления Docker
class DockerMCPServer {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.setupHandlers();
  }

  setupHandlers() {
    this.rl.on('line', (line) => {
      try {
        const message = JSON.parse(line);
        this.handleMessage(message);
      } catch (error) {
        this.sendError('Invalid JSON', error.message);
      }
    });
  }

  handleMessage(message) {
    switch (message.method) {
      case 'initialize':
        this.handleInitialize(message);
        break;
      case 'tools/list':
        this.handleToolsList(message);
        break;
      case 'tools/call':
        this.handleToolCall(message);
        break;
      case 'ping':
        this.sendResponse(message.id, {});
        break;
      case 'notifications/initialized':
        // Игнорируем уведомления
        break;
      default:
        this.sendError('Unknown method', message.method);
    }
  }

  handleInitialize(message) {
    this.sendResponse(message.id, {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {},
        logging: {}
      },
      serverInfo: {
        name: 'docker-manager',
        version: '1.0.0'
      }
    });
  }

  handleToolsList(message) {
    this.sendResponse(message.id, {
      tools: [
        {
          name: 'docker_status',
          description: 'Показать статус Docker контейнеров TaskManager',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        },
        {
          name: 'docker_start',
          description: 'Запустить все сервисы TaskManager',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        },
        {
          name: 'docker_stop',
          description: 'Остановить все сервисы TaskManager',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        },
        {
          name: 'docker_logs',
          description: 'Показать логи Docker контейнеров',
          inputSchema: {
            type: 'object',
            properties: {
              service: {
                type: 'string',
                description: 'Имя сервиса (postgres, backend, frontend)',
                enum: ['postgres', 'backend', 'frontend']
              }
            },
            required: []
          }
        },
        {
          name: 'docker_build',
          description: 'Собрать Docker образы',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      ]
    });
  }

  handleToolCall(message) {
    const { name, arguments: args } = message.params;
    
    switch (name) {
      case 'docker_status':
        this.runDockerCommand(['compose', '-f', 'docker-compose.yml', 'ps'], message.id);
        break;
      case 'docker_start':
        this.runDockerCommand(['compose', '-f', 'docker-compose.yml', 'up', '-d'], message.id);
        break;
      case 'docker_stop':
        this.runDockerCommand(['compose', '-f', 'docker-compose.yml', 'down'], message.id);
        break;
      case 'docker_logs':
        const service = args?.service || '';
        const logArgs = service ? ['compose', '-f', 'docker-compose.yml', 'logs', service] : ['compose', '-f', 'docker-compose.yml', 'logs'];
        this.runDockerCommand(logArgs, message.id);
        break;
      case 'docker_build':
        this.runDockerCommand(['compose', '-f', 'docker-compose.yml', 'build'], message.id);
        break;
      default:
        this.sendError('Unknown tool', name);
    }
  }

  runDockerCommand(args, messageId) {
    const docker = spawn('docker', args, {
      cwd: '/Users/maxim/Project/Taskmanager2',
      env: {
        ...process.env,
        POSTGRES_PASSWORD: 'taskmanager123',
        SECRET_KEY: 'dev-secret-key-change-in-production',
        FLASK_ENV: 'development'
      }
    });

    let output = '';
    let error = '';

    docker.stdout.on('data', (data) => {
      output += data.toString();
    });

    docker.stderr.on('data', (data) => {
      error += data.toString();
    });

    docker.on('close', (code) => {
      if (code === 0) {
        this.sendResponse(messageId, {
          content: [
            {
              type: 'text',
              text: output || 'Команда выполнена успешно'
            }
          ]
        });
      } else {
        this.sendResponse(messageId, {
          content: [
            {
              type: 'text',
              text: `Ошибка выполнения команды (код: ${code}):\n${error}`
            }
          ]
        });
      }
    });
  }

  sendResponse(id, result) {
    const response = {
      jsonrpc: '2.0',
      id,
      result
    };
    console.log(JSON.stringify(response));
  }

  sendError(message, data) {
    const error = {
      jsonrpc: '2.0',
      error: {
        code: -32600,
        message,
        data
      }
    };
    console.log(JSON.stringify(error));
  }
}

// Запуск сервера
new DockerMCPServer();

