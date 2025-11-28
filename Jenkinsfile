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

    stage('Generate Kubernetes Secret') {
        steps {
            withCredentials([file(credentialsId: 'env-file', variable: 'ENV_FILE_PATH')]) {

                sh '''
                    mkdir -p k8s
                    echo "apiVersion: v1
kind: Secret
metadata:
  name: node-app-secret
type: Opaque
stringData:" > k8s/node-app-secret.yaml

    while IFS='=' read -r key value || [ -n "$key" ]; do
        case "$key" in
            ""|*[![:space:]]*) ;;   
            *) continue ;; 
        esac

        esc_value=$(printf "%s" "$value" | sed 's/"/\\"/g')
        echo "  $key: \\"$esc_value\\"" >> k8s/node-app-secret.yaml

    done < "$ENV_FILE_PATH"
'''
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
