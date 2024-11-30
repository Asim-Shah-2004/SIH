import * as FileSystem from 'expo-file-system';

export const downloadPdf = async (url, filename) => {
  try {
    // Define the path where the file will be saved (using the app's document directory)
    const fileUri = FileSystem.documentDirectory + filename;

    // Download the PDF file from the given URL
    const downloadResult = await FileSystem.downloadAsync(url, fileUri);

    if (downloadResult.status === 200) {
      console.log('File downloaded successfully!');
    } else {
      console.error('Download failed, status:', downloadResult.status);
    }
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};
