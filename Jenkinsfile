library 'shared-libraries@revert-fe8f831c'

node(consts().AGENT_LABEL) {
    timestamps {
    
      cleanWorkspace()
      buildInit() // git clone

      final defaultDockerFlags = "--user ${CONSTS.JENKINS_AGENT_USER_ID}:${CONSTS.JENKINS_AGENT_GROUP_ID} -v /var/run/docker.sock:/var/run/docker.sock"
      final dockerFlags = defaultDockerFlags

      withAWS(credentials: CONSTS.JENKINS_AWS_CREDENTIALS ,role: CONSTS.JENKINS_AWS_IAM_ROLE, roleAccount: CONSTS.AWS_ACCOUNT_ID) {
              docker.image("${CONSTS.DOCKER_REGISTRY}/${CONSTS.PYTHON_DOCKER_REPOSITORY}:${CONSTS.PYTHON_DOCKER_IMAGE_TAG}").inside(dockerFlags) {
                  docker.image("${CONSTS.DOCKER_REGISTRY}/${CONSTS.NODEJS_DOCKER_REPOSITORY}:${CONSTS.NODEJS_DOCKER_IMAGE_TAG}").inside("--user ${CONSTS.JENKINS_AGENT_USER_ID}:${CONSTS.JENKINS_AGENT_GROUP_ID}") {
                      final awsInfraRepoName = CONSTS.AWS_INFRA_GITLAB_REPONAME 
                      gitCheckout.clone(awsInfraRepoName, awsInfraRepoName, 'deep', 'devops/old-cdk-version')
                      dir("${awsInfraRepoName}/general") {
                          sh """
                              ls -la
                              npm install
                              #aws sts get-caller-identity
                              node --version
                              cdk --version
                              cdk synth -vvv --require-approval=never --app 'npx -dd ts-node --prefer-ts-exts bin/s3Buckets.ts' sdkDocsBucket
                              #cdk diff -vvv --require-approval=never --app 'npx ts-node --prefer-ts-exts bin/s3Buckets.ts' sdkDocsBucket
                              #cdk deploy -vvv --require-approval=never --app 'npx ts-node --prefer-ts-exts bin/s3Buckets.ts' sdkDocsBucket
                              """
                      }
                  }
              }                      
      }

    }
}
