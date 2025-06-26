import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#34e3b0',
  secondary: '#34e3b0',
  background: '#f6fbfa',
  ownMessage: '#E8F4EA',
  recording: '#34e3b0',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily:'Poppins_700Bold', // Make sure this font is loaded in your app
  },
  messagesList: {
    flex: 1,
  },
  dateContainer: {
    alignSelf: 'center',
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dateText: {
    color: '#555',
    fontSize: 12,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 8,
    padding: 10,
    minWidth: 80,
    flexDirection: 'column',
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  ownMessage: {
    backgroundColor: COLORS.ownMessage,
    borderBottomRightRadius: 2,
  },
  otherMessage: {
    backgroundColor: COLORS.otherMessage,
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  imageMessage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 4,
  },
  documentMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  documentText: {
    marginLeft: 8,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 150,
    paddingVertical: 4,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  playButtonOwn: {
    backgroundColor: 'white',
  },
  playButtonOther: {
    backgroundColor: COLORS.primary,
  },
  voiceInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 30,
    flexGrow: 1,
    marginRight: 10,
  },
  waveBar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 1,
  },
  voiceTime: {
    fontSize: 12,
  },
  messageTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    justifyContent: 'center',
    minHeight: 50,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxHeight: 120,
  },
  attachButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  micButtonActive: {
    backgroundColor: COLORS.recording,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.recording,
    marginRight: 10,
  },
  recordingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordingHint: {
    color: '#ccc',
    fontSize: 12,
    marginLeft: 10,
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalClose: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 10,
    right: 10,
    zIndex: 1,
    padding: 10,
  },
  fullScreenImage: {
    width: width,
    height: height - (Platform.OS === 'ios' ? 80 : 20),
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  menuBox: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 80 : 50,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 5,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});