import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useUser } from '../context/UserContext';
import { useLessons } from '../context/LessonContext';

export default function LessonsScreen({ navigation }: any) {
  const { user } = useUser();
  const { stages, loading } = useLessons();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading lessons...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isLessonCompleted = (stageId: number, lessonId: number) => {
    return user.completedLessons.some(
      completed => completed.stageId === stageId && completed.lessonId === lessonId
    );
  };

  const isLessonLocked = (stageId: number, lessonId: number) => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return true;
    
    // First lesson is always unlocked
    if (lessonId === 1) return false;
    
    // Check if previous lesson is completed
    const previousLessonCompleted = isLessonCompleted(stageId, lessonId - 1);
    return !previousLessonCompleted;
  };

  const getStageProgress = (stageId: number) => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return 0;
    
    const completedCount = stage.lessons.filter(lesson => 
      isLessonCompleted(stageId, lesson.id)
    ).length;
    
    return (completedCount / stage.lessons.length) * 100;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lessons</Text>
        <View style={styles.xpContainer}>
          <Icon name="star" size={20} color="#fbbf24" />
          <Text style={styles.xpText}>{user.xp} XP</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {stages.map((stage) => (
          <View key={stage.id} style={styles.stageContainer}>
            <View style={styles.stageHeader}>
              <View style={styles.stageInfo}>
                <Text style={styles.stageTitle}>{stage.title}</Text>
                <Text style={styles.stageDescription}>{stage.description}</Text>
              </View>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  {Math.round(getStageProgress(stage.id))}%
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${getStageProgress(stage.id)}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>

            <View style={styles.lessonsContainer}>
              {stage.lessons.map((lesson) => {
                const completed = isLessonCompleted(stage.id, lesson.id);
                const locked = isLessonLocked(stage.id, lesson.id);

                return (
                  <TouchableOpacity
                    key={lesson.id}
                    style={[
                      styles.lessonCard,
                      locked && styles.lessonCardLocked,
                      completed && styles.lessonCardCompleted,
                    ]}
                    onPress={() => {
                      if (!locked) {
                        navigation.navigate('LessonDetail', {
                          stageId: stage.id,
                          lessonId: lesson.id,
                        });
                      }
                    }}
                    disabled={locked}
                  >
                    <View style={styles.lessonIcon}>
                      {completed ? (
                        <Icon name="check-circle" size={32} color="#10b981" />
                      ) : locked ? (
                        <Icon name="lock" size={32} color="#9ca3af" />
                      ) : (
                        <Icon name="play-circle-filled" size={32} color="#2563eb" />
                      )}
                    </View>

                    <View style={styles.lessonContent}>
                      <Text style={[
                        styles.lessonTitle,
                        locked && styles.lessonTitleLocked
                      ]}>
                        {lesson.title}
                      </Text>
                      <Text style={[
                        styles.lessonDescription,
                        locked && styles.lessonDescriptionLocked
                      ]}>
                        {lesson.description}
                      </Text>
                      
                      <View style={styles.lessonMeta}>
                        <View style={styles.metaItem}>
                          <Icon name="schedule" size={16} color="#6b7280" />
                          <Text style={styles.metaText}>{lesson.duration} min</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Icon name="star" size={16} color="#fbbf24" />
                          <Text style={styles.metaText}>{lesson.xpReward} XP</Text>
                        </View>
                      </View>
                    </View>

                    <Icon 
                      name="chevron-right" 
                      size={24} 
                      color={locked ? "#d1d5db" : "#6b7280"} 
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  stageContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stageHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  stageInfo: {
    marginBottom: 12,
  },
  stageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  stageDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
    marginRight: 8,
    minWidth: 32,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 3,
  },
  lessonsContainer: {
    padding: 16,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  lessonCardLocked: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  lessonCardCompleted: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  lessonIcon: {
    marginRight: 16,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  lessonTitleLocked: {
    color: '#9ca3af',
  },
  lessonDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  lessonDescriptionLocked: {
    color: '#d1d5db',
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
});