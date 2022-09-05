import { Construct } from "constructs";
import { join, resolve } from "path";
import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Runtime, Architecture, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

export class AgricolaCardImageGeneratorStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const srcPath = resolve(__dirname, "../src");

    const lambda = new NodejsFunction(this, "AgricolaCardImageGeneratorFunc", {
      entry: join(srcPath, "index.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_16_X,
      architecture: Architecture.X86_64,
      memorySize: 1600,
      timeout: Duration.seconds(8),
      bundling: {
        target: "node16.15",
        tsconfig: join(srcPath, "tsconfig.json"),
        nodeModules: ["hogan.js", "puppeteer-core", "@sparticuz/chrome-aws-lambda", "zod", "svg64"],
        commandHooks: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          beforeInstall(inputDir: string, outputDir: string): string[] {
            return [];
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          beforeBundling(inputDir: string, outputDir: string): string[] {
            return [];
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [`cp -r ${inputDir}/src/assets ${outputDir}/assets`];
          },
        },
      },
      logRetention: RetentionDays.ONE_DAY,
    });

    lambda.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });
  }
}
