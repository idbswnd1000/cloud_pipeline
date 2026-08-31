pipeline {

    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        COMPOSE_PROJECT_NAME = 'pipeline'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Environment') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'pipeline-env',
                        variable: 'ENV_FILE'
                    )
                ]) {
                    sh '''
                        cp "$ENV_FILE" .env
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker compose build --pull
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker compose up -d --remove-orphans
                '''
            }
        }

        stage('Check') {
            steps {
                sh '''
                    docker compose ps
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                    docker image prune -f
                '''
            }
        }
    }

    post {

        success {
            echo '배포 성공'
        }

        failure {
            echo '배포 실패'

            sh '''
                docker compose logs --tail=100 || true
            '''
        }

        always {
            sh '''
                rm -f .env
            '''
        }
    }
}