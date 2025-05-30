import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useUser } from '../context/UserContext';
import { useLessons } from '../context/LessonContext';

export default function ProfileScreen() {
  const { user } = useUser();
  const { stages } = useLessons();

  const totalLessons = stages.reduce((total, stage) => total + stage.lessons.length, 0);
  const completedLessonsCount = user.completedLessons.length;
  const progressPercentage = (completedLessonsCount / totalLessons) * 100;

  const achievements = [
    {
      id: 'first_lesson',
      title: 'First Steps',
      description: 'Completed your first lesson',
      icon: 'school',
      color: '#10b981',
      earned: completedLessonsCount > 0,
    },
    {
      id: 'streak_3',
      title: 'Consistent Learner',
      description: '3-day learning streak',
      icon: 'local-fire-department',
      color: '#f59e0b',
      earned: user.streakDays >= 3,
    },
    {
      id: 'xp_100',
      title: 'XP Collector',
      description: 'Earned 100 XP',
      icon: 'star',
      color: '#8b5cf6',
      earned: user.xp >= 100,
    },
    {
      id: 'stage_complete',
      title: 'Stage Master',
      description: 'Completed a full stage',
      icon: 'emoji-events',
      color: '#ef4444',
      earned: stages.some(stage => 
        stage.lessons.every(lesson => 
          user.completedLessons.some(completed => 
            completed.stageId === stage.id && completed.lessonId === lesson.id
          )
        )
      ),
    },
  ];

  const earnedAchievements = achievements.filter(achievement => achievement.earned);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Icon name="account-circle" size={80} color="#2563eb" />
          </View>
          <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <View style={styles.xpContainer}>
            <Icon name="star" size={24} color="#fbbf24" />
            <Text style={styles.xpText}>{user.xp} XP</Text>
          </View>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressCard}>
          <Text style={styles.cardTitle}>Learning Progress</Text>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          
          <Text style={styles.progressText}>
            {completedLessonsCount} of {totalLessons} lessons completed ({Math.round(progressPercentage)}%)
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="local-fire-department" size={24} color="#f59e0b" />
              <Text style={styles.statNumber}>{user.streakDays}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            
            <View style={styles.statItem}>
              <Icon name="school" size={24} color="#10b981" />
              <Text style={styles.statNumber}>{completedLessonsCount}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
            
            <View style={styles.statItem}>
              <Icon name="emoji-events" size={24} color="#8b5cf6" />
              <Text style={styles.statNumber}>{earnedAchievements.length}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsCard}>
          <Text style={styles.cardTitle}>Achievements</Text>
          
          {achievements.map((achievement) => (
            <View 
              key={achievement.id} 
              style={[
                styles.achievementItem,
                !achievement.earned && styles.achievementItemLocked
              ]}
            >
              <View style={[
                styles.achievementIcon,
                { backgroundColor: achievement.earned ? achievement.color : '#e5e7eb' }
              ]}>
                <Icon 
                  name={achievement.icon} 
                  size={24} 
                  color={achievement.earned ? '#ffffff' : '#9ca3af'} 
                />
              </View>
              
              <View style={styles.achievementContent}>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.earned && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  !achievement.earned && styles.achievementDescriptionLocked
                ]}>
                  {achievement.description}
                </Text>
              </View>
              
              {achievement.earned && (
                <Icon name="check-circle" size={24} color="#10b981" />
              )}
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.activityCard}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          
          {user.completedLessons.slice(-5).reverse().map((lesson, index) => {
            const stage = stages.find(s => s.id === lesson.stageId);
            const lessonData = stage?.lessons.find(l => l.id === lesson.lessonId);
            
            return (
              <View key={index} style={styles.activityItem}>
                <Icon name="check-circle" size={20} color="#10b981" />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    Completed: {lessonData?.title || 'Unknown Lesson'}
                  </Text>
                  <Text style={styles.activityDate}>
                    {new Date(lesson.completedAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.activityXP}>+{lesson.xpEarned} XP</Text>
              </View>
            );
          })}
          
          {user.completedLessons.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="school" size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>No completed lessons yet</Text>
              <Text style={styles.emptyStateSubtext}>Start learning to see your progress here</Text>
            </View>
          )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  xpText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 6,
  },
  progressCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
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
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  achievementsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  achievementItemLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  achievementTitleLocked: {
    color: '#9ca3af',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  achievementDescriptionLocked: {
    color: '#d1d5db',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  activityDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  activityXP: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
});