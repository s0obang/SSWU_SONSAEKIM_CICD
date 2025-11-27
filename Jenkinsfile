pipeline {
    agent any

    environment {
    DOCKER_LOGIN = credentials('dockerhub-login')
}

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Login') {
            steps {
                sh """
                echo "$DOCKER_LOGIN_PSW" | docker login -u "$DOCKER_LOGIN_USR" --password-stdin
                """
            }
        }

        stage('Build Images') {
            steps {
                sh """
                docker compose build
                """
            }
        }

        stage('Push Images') {
            steps {
                sh """
                docker compose push
                """
            }
        }

    }

    post {
        success {
            echo "CI SUCCESS: Images built and pushed to Docker Hub"
        }
        failure {
            echo "CI FAILED"
        }
    }
}

