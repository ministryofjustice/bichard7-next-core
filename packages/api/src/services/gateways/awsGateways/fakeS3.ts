import type AwsS3Gateway from "../interfaces/awsS3Gateway"

class FakeS3 implements AwsS3Gateway {
  private readonly fakeBucket: Record<string, Array<string>> = {}

  uploadFileIntoS3(bucketName: string, file: string) {
    this.fakeBucket[bucketName].push(file)
  }
}

export default FakeS3
