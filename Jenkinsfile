pipeline {
    agent any

    environment {
        DOCKER_LOGIN = credentials('dockerhub-login')
        CREDENTIALS_ID = '2b8ffc9d-989a-47d3-a15f-1d34486232b0'

        PROJECT_ID = 'dulcet-clock-477102-m7'
        CLUSTER_NAME = 'kube'
        LOCATION = 'us-central1-a'
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
                sh "docker compose build"
            }
        }

        stage('Push Images') {
            steps {
                sh "docker compose push"
            }
        }
        stage('Prepare Secret File') {
            steps {
                sh "chmod -R 777 k8s || true"
                withCredentials([file(credentialsId: 'k8s-secret-file', variable: 'SECRET_FILE')]) {
                    sh """
                        echo "Copying secret file into repo directory"
                        cp "$SECRET_FILE" k8s/node-app-secret.yaml
                        chown jenkins:jenkins k8s/node-app-secret.yaml || true
                    """
                }
            }
        }

        stage('Deploy to GKE') {
            when {
                branch 'main'
            }
            steps {
                step([
                    $class: 'KubernetesEngineBuilder',
                    projectId: env.PROJECT_ID,
                    clusterName: env.CLUSTER_NAME,
                    location: env.LOCATION,

                    manifestPattern: 'k8s/*.yaml',

                    credentialsId: env.CREDENTIALS_ID,
                    verifyDeployments: true
                ])
            }
        }
    }

    post {
        success { echo "SUCCESS" }
        failure { echo "FAILED" }
    }
    
}
