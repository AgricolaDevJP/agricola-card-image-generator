import { Construct } from "constructs";
import { join, resolve } from "path";
import { Duration, Stack, StackProps } from "aws-cdk-lib";
import {
  Runtime,
  Architecture,
  FunctionUrlAuthType,
} from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

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
        nodeModules: [
          "hogan.js",
          "puppeteer-core",
          "@sparticuz/chrome-aws-lambda",
          "zod",
        ],
        commandHooks: {
          beforeInstall(_inputDir: string, _outputDir: string): string[] {
            return [];
          },
          beforeBundling(_inputDir: string, _outputDir: string): string[] {
            return [];
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [`cp -r ${inputDir}/src/assets ${outputDir}/assets`];
          },
        },
      },
    });

    const url = lambda.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });
  }
}
