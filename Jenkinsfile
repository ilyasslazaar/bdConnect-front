node {
    stage('SCM Checkout'){
	checkout scm
    }
    stage('Build application'){
        sh  'docker-compose up -d --build'
    }
}
