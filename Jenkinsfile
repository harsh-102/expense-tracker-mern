pipeline {
    agent any

    environment {
        // Adds common mac/homebrew Paths in case Jenkins is running as a service and misses them
        PATH = "/usr/local/bin:/opt/homebrew/bin:$PATH"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout code from the linked SCM (Git)
                checkout scm
            }
        }

        stage('Backend: Install & Test') {
            steps {
                dir('backend') {
                    // Inject local .env file securely into the jenkins workspace 
                    sh 'cp /Users/harshita/MERN_PROJECT/backend/.env ./ || true'
                    
                    sh 'npm install'
                    sh 'npm run test'
                }
            }
        }

        stage('Frontend: Install & Test') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run test' // Vitest
                }
            }
        }

        stage('Frontend: Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy Locally with PM2') {
            steps {
                // This starts or restarts the backend and static frontend server
                sh 'npm install -g pm2 || true' // Ensure PM2 is installed globally
                sh 'pm2 start ecosystem.config.js || pm2 restart ecosystem.config.js'
                sh 'pm2 save'
            }
        }
    }
}
