import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useUser } from '../context/UserContext';
import { useLessons } from '../context/LessonContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const { user } = useUser();
  const { stages } = useLessons();

  const currentStage = stages.find(stage => stage.id === user.currentStage);
  const completedLessonsCount = user.completedLessons.length;
  const totalLessons = stages.reduce((total, stage) => total + stage.lessons.length, 0);
  const progressPercentage = (completedLessonsCount / totalLessons) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user.firstName}!</Text>
            <Text style={styles.subtitle}>Ready to learn today?</Text>
          </View>
          <View style={styles.xpContainer}>
            <Icon name="star" size={24} color="#fbbf24" />
            <Text style={styles.xpText}>{user.xp} XP</Text>
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {completedLessonsCount} of {totalLessons} lessons completed
          </Text>
        </View>

        {/* Current Stage */}
        {currentStage && (
          <View style={styles.currentStageCard}>
            <Text style={styles.cardTitle}>Current Stage</Text>
            <Text style={styles.stageTitle}>{currentStage.title}</Text>
            <Text style={styles.stageDescription}>{currentStage.description}</Text>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => navigation.navigate('Lessons')}
            >
              <Text style={styles.continueButtonText}>Continue Learning</Text>
              <Icon name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Icon name="local-fire-department" size={32} color="#f59e0b" />
            <Text style={styles.statNumber}>{user.streakDays}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="emoji-events" size={32} color="#8b5cf6" />
            <Text style={styles.statNumber}>{user.earnedBadges.length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="school" size={32} color="#10b981" />
            <Text style={styles.statNumber}>{completedLessonsCount}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Lessons')}
          >
            <Icon name="play-circle-filled" size={40} color="#2563eb" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Continue Lesson</Text>
              <Text style={styles.actionSubtitle}>Pick up where you left off</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="account-circle" size={40} color="#7c3aed" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>View Profile</Text>
              <Text style={styles.actionSubtitle}>Check your achievements</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  xpText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 6,
  },
  progressCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
  },
  currentStageCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  stageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  stageDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 24,
  },
  continueButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionContent: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
});