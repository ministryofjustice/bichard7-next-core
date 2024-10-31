import type AwsS3Gateway from "../interfaces/awsS3Gateway"

class FakeAwsS3Gateway implements AwsS3Gateway {
  private readonly fakeBucket: Record<string, Array<string>> = {}

  uploadFileIntoS3(bucketName: string, file: string) {
    this.fakeBucket[bucketName].push(file)
  }
}

export default FakeAwsS3Gateway
