const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const School = require('./models/School');

const schools = [
  {
    name: 'Zilla Parishad High School, Gopalapatnam',
    location: 'Gopalapatnam, Visakhapatnam',
    status: 'approved',
    principalName: 'Sri K. Venkata Rao',
    principalMessage: 'We believe every child deserves quality education. Our school strives to create a nurturing environment where students can grow academically and personally. We welcome community support through EduBridge to further enrich our students learning experience.',
    overview: 'Zilla Parishad High School Gopalapatnam is a government school serving over 400 students from Classes 6 to 10. Established in 1978, the school has a strong academic record and is known for its dedicated teaching staff and community involvement.',
    facilities: [
      'Library with 2000+ books',
      'Science Laboratory',
      'Computer Lab with 20 systems',
      'Playground and sports ground',
      'Mid-day meal program',
      'Drinking water facility',
      'Separate restrooms for boys and girls',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
    ],
  },
  {
    name: 'Municipal High School, Gajuwaka',
    location: 'Gajuwaka, Visakhapatnam',
    principalName: 'Smt. P. Lakshmi Devi',
    status: 'approved',
    principalMessage: 'Education is the most powerful tool we can give our children. At Municipal High School Gajuwaka, we are committed to providing holistic education to children from underserved communities. Partnerships like EduBridge help us bridge the gap between resources and need.',
    overview: 'Municipal High School Gajuwaka serves over 550 students from the industrial township of Gajuwaka. The school focuses on bilingual education (Telugu and English medium) and has produced several district-level academic toppers over the years.',
    facilities: [
      'Digital classroom with projector',
      'Science and Math Lab',
      'School garden and eco-club',
      'Sports facilities including volleyball court',
      'Free textbook distribution',
      'Scholarship programs for meritorious students',
      'Counseling room',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
    ],
  },
  {
    name: 'Government High School, Kommadi',
    location: 'Kommadi, Visakhapatnam',
    principalName: 'Sri M. Srinivasa Murthy',
    status: 'approved',
    principalMessage: 'Our school is more than just a place of learning — it is a second home for our students. We are grateful for initiatives like EduBridge that connect us with volunteers and donors who share our vision of quality education for all children regardless of their background.',
    overview: 'Government High School Kommadi is located in the rapidly growing Kommadi area near Rushikonda. With over 320 students enrolled, the school serves families from fishing and agricultural communities. The school actively encourages first-generation learners and has strong parental involvement.',
    facilities: [
      'Newly renovated classrooms',
      'Basic science laboratory',
      'Library corner with reading materials',
      'Clean drinking water with RO purifier',
      'Mid-day meal kitchen',
      'Annual sports day and cultural events',
      'Bridge course for weaker students',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400',
      'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400',
      'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=400',
    ],
  },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB Connected...')

    await School.deleteMany({})
    console.log('Cleared existing schools...')

    await School.insertMany(schools)
    console.log('✅ 3 schools seeded successfully!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    process.exit(1)
  }
}

seed()