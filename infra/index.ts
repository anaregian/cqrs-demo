import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

const cluster = new aws.ecs.Cluster('cluster', {});

const loadBalancer = new awsx.lb.ApplicationLoadBalancer('loadBalancer', {});

const repo = new awsx.ecr.Repository('repo', {
  forceDelete: true,
  name: 'cqrs-demo',
});

const image = new awsx.ecr.Image('image', {
  repositoryUrl: repo.url,
  path: '..',
});

const db = new aws.rds.Instance('default', {
  engine: 'postgres',
  engineVersion: '14.5',
  instanceClass: 'db.t3.micro',
  dbName: 'cqrs_demo_db',
  username: 'postgres',
  password: 'postgres',
  allocatedStorage: 20,
  skipFinalSnapshot: true,
  publiclyAccessible: true,
});

const service = new awsx.ecs.FargateService('service', {
  cluster: cluster.arn,
  assignPublicIp: true,
  taskDefinitionArgs: {
    container: {
      image: image.imageUri,
      cpu: 512,
      memory: 128,
      essential: true,
      environment: [
        {
          name: 'DB_HOST',
          value: db.endpoint,
        },
        {
          name: 'DB_USER',
          value: 'postgres',
        },
        {
          name: 'DB_PASS',
          value: 'postgres',
        },
        {
          name: 'DB_NAME',
          value: 'cqrs_demo_db',
        },
        {
          name: 'DB_PORT',
          value: '5432',
        },
        {
          name: 'APP_PORT',
          value: '80',
        },
      ],
      portMappings: [
        {
          containerPort: 80,
          targetGroup: loadBalancer.defaultTargetGroup,
        },
      ],
    },
  },
});

export const url = pulumi.interpolate`http://${loadBalancer.loadBalancer.dnsName}`;
