
import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from './constants';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  screenBackground: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
greetingContainer: {
  paddingHorizontal: 20,
  marginTop: 0, // was 32
},
scrollView: {
  flex: 1,
  marginTop: 0, // was 72
},

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.background,
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  logoText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 14,
  },
  scrollView: {
    flex: 1,
    marginTop: 72,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  greetingContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  greetingText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: COLORS.text,
  },
  greetingSubText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 2,
  },
  carouselContainer: {
    marginTop: 22,
    marginBottom: 8,
    alignSelf: 'center',
  },
  carousel: {
    borderRadius: 18,
        
  },
  carouselItem: {
    borderRadius: 18,
    overflow: 'hidden',
    width: width - 40,
    height: 140,
    backgroundColor: '#e0f3ea',
    justifyContent: 'flex-end',
     marginHorizontal: 6,

  },
  carouselImage: {
    gap:40,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  carouselOverlay: {
    backgroundColor: 'rgba(36, 39, 99, 0.30)',
    padding: 14,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  carouselTitle: {
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  carouselSubtitle: {
    color: '#fff',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16.5,
    color: COLORS.text,
  },
  sectionAction: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13.5,
    color: COLORS.secondary,
  },
  coursesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 18,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 2,
  },
  courseImage: {
    width: 62,
    height: 62,
    borderRadius: 10,
    marginRight: 14,
  },
  courseCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  courseTitleContainer: {
    flex: 1,
    marginRight: 5,
  },
  courseTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15.5,
    color: COLORS.text,
  },
  courseMentor: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12.5,
    color: COLORS.muted,
    marginTop: 2,
  },
  courseDuration: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12.5,
    color: COLORS.muted,
    marginLeft: 8,
    minWidth: 54,
    textAlign: 'right',
  },
  courseCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  bookmarkIcon: {
    marginLeft: 10,
  },

  // Avatars
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarsStack: {
    flexDirection: 'row',
  },
  avatarImage: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#fff',
  },
  avatarImageOverlap: {
    marginLeft: -7,
  },
  avatarsCount: {
    fontFamily: 'Poppins_400Regular',
    color: COLORS.muted,
    fontSize: 13,
    marginLeft: 8,
  },
});
