interface AwsS3Gateway {
  uploadFileIntoS3: (bucketName: string, file: string) => void
}

export default AwsS3Gateway
