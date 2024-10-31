import type AwsS3Gateway from "../interfaces/awsS3Gateway"

class AwsS3RemoteGateway implements AwsS3Gateway {
  uploadFileIntoS3(bucketName: string, file: string) {
    console.log(bucketName, file)
  }
}

export default AwsS3RemoteGateway
