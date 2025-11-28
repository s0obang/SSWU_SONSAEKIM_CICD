pipeline {
    agent any

    environment {
        DOCKER_LOGIN = credentials('dockerhub-login')
        KUBE_CONFIG = credentials('gke-kubeconfig')
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

        stage('Generate Kubernetes Secret') {
            steps {
                withKubeConfig(credentialsId: 'gke-kubeconfig') {
                    withCredentials([file(credentialsId: 'env-file', variable: 'ENV_FILE_PATH')]) {

                        sh '''
                        echo "apiVersion: v1
kind: Secret
metadata:
  name: node-app-secret
type: Opaque
stringData:" > kubernetes/node-app-secret.yaml

                        while IFS='=' read -r key value; do
                          if [ -n "$key" ]; then
                            esc_value=$(printf "%s" "$value" | sed 's/"/\\"/g')
                            echo "  $key: \\"$esc_value\\"" >> kubernetes/node-app-secret.yaml
                          fi
                        done < "$ENV_FILE_PATH"

                        kubectl apply -f kubernetes/node-app-secret.yaml
                        '''
                    }
                }
            }
        }

        stage('Deploy to GKE') {
            steps {
                withKubeConfig(credentialsId: 'gke-kubeconfig') {
                    sh "kubectl apply -f kubernetes/deployment.yml"
                }
            }
        }
    }

    post {
        success { echo "CI/CD SUCCESS" }
        failure { echo "CI/CD FAILED" }
    }
}
