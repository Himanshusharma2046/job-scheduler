# Job Scheduler API

A robust and flexible job scheduling system built with Node.js and Express.js that allows you to schedule tasks to run at specific times and intervals. Perfect for automating recurring tasks, system maintenance, and background job processing.

## 🚀 Features

- **Multiple Schedule Types**: Hourly, Daily, Weekly, and Custom Cron expressions
- **Flexible Output**: Console output or file logging
- **Job Management**: Create, read, update, delete, activate/deactivate jobs
- **Real-time Execution**: Execute jobs immediately on demand
- **Comprehensive Logging**: Built-in logging system with file output
- **RESTful API**: Clean and intuitive API endpoints
- **Error Handling**: Robust error handling and validation
- **System Monitoring**: Job statistics and system health monitoring


## 🛠️ Installation

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)

### Clone the Repository

```bash
git clone https://github.com/Himanshusharma2046/job-scheduler.git
cd job-scheduler
```

### Install Dependencies

```bash
npm install
```

### Install Specific Versions (if needed)

```bash
npm install express@4.18.2 path-to-regexp@6.2.1
```

### Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

## 🚀 Quick Start

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The API will be available at `http://localhost:3000`

### Health Check

```bash
curl http://localhost:3000/health
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/jobs
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/jobs` | Create a new job |
| `GET` | `/api/jobs` | Get all jobs |
| `GET` | `/api/jobs/:id` | Get a specific job |
| `PUT` | `/api/jobs/:id` | Update a job |
| `DELETE` | `/api/jobs/:id` | Delete a job |
| `POST` | `/api/jobs/:id/activate` | Activate a job |
| `POST` | `/api/jobs/:id/deactivate` | Deactivate a job |
| `POST` | `/api/jobs/:id/execute` | Execute a job immediately |
| `GET` | `/api/jobs/stats` | Get system statistics |
| `GET` | `/health` | Health check |

## 📅 Schedule Types

### 1. Hourly Jobs
Runs at a specific minute of every hour.

```json
{
  "schedule": {
    "type": "hourly",
    "value": {
      "minute": 30
    }
  }
}
```

### 2. Daily Jobs
Runs at a specific time every day.

```json
{
  "schedule": {
    "type": "daily",
    "value": {
      "hour": 9,
      "minute": 15
    }
  }
}
```

### 3. Weekly Jobs
Runs on a specific day of the week at a specific time.

```json
{
  "schedule": {
    "type": "weekly",
    "value": {
      "dayOfWeek": 1,
      "hour": 10,
      "minute": 0
    }
  }
}
```

**Day of Week Values:**
- 0 = Sunday
- 1 = Monday
- 2 = Tuesday
- 3 = Wednesday
- 4 = Thursday
- 5 = Friday
- 6 = Saturday

### 4. Custom Cron Jobs
Use custom cron expressions for complex scheduling.

```json
{
  "schedule": {
    "type": "custom",
    "value": {
      "cronExpression": "*/5 * * * *"
    }
  }
}
```

## 💡 Usage Examples

### Create an Hourly Job

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hourly System Check",
    "schedule": {
      "type": "hourly",
      "value": {
        "minute": 0
      }
    },
    "type": "console"
  }'
```

### Create a Daily Job with File Output

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Backup",
    "schedule": {
      "type": "daily",
      "value": {
        "hour": 2,
        "minute": 30
      }
    },
    "type": "file",
    "filePath": "./logs/daily-backup.log"
  }'
```

### Create a Weekly Report Job

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weekly Report",
    "schedule": {
      "type": "weekly",
      "value": {
        "dayOfWeek": 1,
        "hour": 9,
        "minute": 0
      }
    },
    "type": "console"
  }'
```

### Get All Jobs

```bash
curl http://localhost:3000/api/jobs
```

### Execute a Job Immediately

```bash
curl -X POST http://localhost:3000/api/jobs/{job-id}/execute
```

### Update a Job

```bash
curl -X PUT http://localhost:3000/api/jobs/{job-id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Job Name",
    "schedule": {
      "type": "daily",
      "value": {
        "hour": 14,
        "minute": 30
      }
    }
  }'
```

### Deactivate a Job

```bash
curl -X POST http://localhost:3000/api/jobs/{job-id}/deactivate
```

### Get System Statistics

```bash
curl http://localhost:3000/api/jobs/stats
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `LOG_LEVEL` | Logging level | `info` |

### Job Types

- **console**: Output to console/terminal
- **file**: Write to specified file path

## 📁 Project Structure

```
job-scheduler/
├── src/
│   ├── controllers/
│   │   └── jobController.js
│   ├── models/
│   │   └── Job.js
│   ├── services/
│   │   ├── jobService.js
│   │   └── scheduler.js
│   ├── routes/
│   │   └── jobRoutes.js
│   ├── middleware/
│   │   └── validation.js
│   ├── utils/
│   │   └── logger.js
│   └── app.js
├── logs/
├── package.json
├── .env
├── .gitignore
├── server.js
└── README.md


```

## 🧪 Testing

### Run Test Script

```bash
# Install axios for testing
npm install axios

# Run the test script
node test-jobs.js
```

### Manual Testing

1. Start the server: `npm run dev`
2. Create a test job with a short interval
3. Monitor the console/log files for execution
4. Test all API endpoints using curl or Postman

## 📊 Monitoring and Logs

### Log Files

- `logs/info.log` - General application logs
- `logs/error.log` - Error logs
- `logs/warn.log` - Warning logs
- `logs/debug.log` - Debug logs

### System Statistics

Access real-time system statistics:

```bash
curl http://localhost:3000/api/jobs/stats
```

Response includes:
- Total jobs count
- Active/inactive jobs
- System uptime
- Memory usage
- Scheduled jobs count

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change port in .env file or kill existing process
   lsof -ti:3000 | xargs kill -9
   ```

2. **Path-to-regexp error**
   ```bash
   npm install express@4.18.2 path-to-regexp@6.2.1
   ```

3. **Permission denied for log files**
   ```bash
   mkdir -p logs
   chmod 755 logs
   ```

### Debug Mode

Set environment variable for detailed logging:

```bash
NODE_ENV=development npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass

## 📝 API Response Examples

### Successful Job Creation

```json
{
  "message": "Job created and scheduled successfully",
  "job": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Test Job",
    "schedule": {
      "type": "hourly",
      "value": { "minute": 30 }
    },
    "type": "console",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "isActive": true,
    "cronExpression": "30 * * * *",
    "runCount": 0
  }
}
```

### Error Response

```json
{
  "error": "Schedule type must be one of: hourly, daily, weekly, custom",
  "timestamp": "2023-12-01T10:00:00.000Z"
}
```


