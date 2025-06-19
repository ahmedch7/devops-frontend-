pipeline {
    agent any

    environment {
        // SCM
        GIT_CREDENTIALS_ID = 'github_access'
        GIT_REPO_URL = 'https://github.com/ahmedch7/groupe2-arctic1-2425.git'
        GIT_BRANCH = 'test'

        // SonarQube
        SONAR_URL = 'http://192.168.56.11:9000'
        SONAR_LOGIN = 'admin'
        SONAR_PASSWORD = 'sonar'

        // Docker image
        DOCKER_IMAGE = 'foyer-app'
        DOCKERHUB_REPO = 'ahmedch7/ahmedcheikhrouhou-foyer-app'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                git credentialsId: "${GIT_CREDENTIALS_ID}", url: "${GIT_REPO_URL}", branch: "${GIT_BRANCH}"
            }
        }

        stage('Lister les fichiers récupérés') {
            steps {
                sh 'ls -la'
            }
        }

        stage('Nettoyage') {
            steps {
                sh 'mvn clean'
            }
        }

        stage('Compilation') {
            steps {
                sh 'mvn compile'
            }
        }

        stage('Tests unitaires') {
            steps {
                sh 'mvn test'
            }
        }

        stage('Analyse SonarQube') {
            steps {
                sh """
                    mvn sonar:sonar \
                        -Dsonar.login=${SONAR_LOGIN} \
                        -Dsonar.password=${SONAR_PASSWORD}
                """
            }
        }

        stage('Packaging') {
            steps {
                sh 'mvn package -DskipTests'
            }
        }

        stage('Trouver JAR') {
            steps {
                script {
                    def jar = sh(script: 'ls target/*.jar | grep -v original | head -n 1', returnStdout: true).trim()
                    env.JAR_NAME = jar.replaceAll('target/', '')
                    echo "🗂️ JAR détecté : ${env.JAR_NAME}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build --file Dockerfile --build-arg JAR_FILE=${env.JAR_NAME} -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage('Docker Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker tag ${DOCKER_IMAGE}:latest ${DOCKERHUB_REPO}:latest
                        docker push ${DOCKERHUB_REPO}:latest
                    """
                }
            }
        }

        stage('Déploiement Docker Compose') {
            when {
                expression { fileExists('docker-compose.yml') }
            }
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d --build'
            }
        }
    }

    post {
        success {
            echo '✅ Build terminé avec succès.'
        }
        failure {
            echo '❌ Build échoué.'
        }
    }
}
