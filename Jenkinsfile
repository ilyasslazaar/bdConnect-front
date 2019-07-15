pipeline {
    agent any
    stages {

        stage('Install les modules NPM'){
            steps{
                sh "npm install"
	     	   }
   	     }
   	     
   	    stage('Compiler les modules Front'){
            steps{
                sh "npm run build"
                                     
	       	}
   	    }   

        stage('Build JOB - EMS-API'){
            steps{
                build job: 'EMS-API'
           }
        }	     
   
      }
                
}
