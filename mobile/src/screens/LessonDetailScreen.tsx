import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useUser } from '../context/UserContext';
import { useLessons } from '../context/LessonContext';
import { LessonContent } from '../types';

export default function LessonDetailScreen({ route, navigation }: any) {
  const { stageId, lessonId } = route.params;
  const { user, addCompletedLesson, updateXP } = useUser();
  const { getLessonById } = useLessons();
  
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, any>>({});

  const lesson = getLessonById(stageId, lessonId);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="error" size={48} color="#ef4444" />
          <Text style={styles.errorText}>Lesson not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = user.completedLessons.some(
    completed => completed.stageId === stageId && completed.lessonId === lessonId
  );

  const currentContent = lesson.content[currentContentIndex];
  const isLastContent = currentContentIndex === lesson.content.length - 1;

  const handleNext = () => {
    if (isLastContent) {
      handleCompleteLesson();
    } else {
      setCurrentContentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(prev => prev - 1);
    }
  };

  const handleCompleteLesson = () => {
    if (!isCompleted) {
      const completedLesson = {
        stageId,
        lessonId,
        completedAt: new Date().toISOString(),
        score: 100,
        xpEarned: lesson.xpReward,
      };
      
      addCompletedLesson(completedLesson);
      
      Alert.alert(
        'Lesson Completed!',
        `Great job! You earned ${lesson.xpReward} XP.`,
        [
          {
            text: 'Continue',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleAnswerSelect = (questionIndex: number, answer: any) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const renderContent = (content: LessonContent, index: number) => {
    switch (content.type) {
      case 'text':
        return (
          <View style={styles.textContent}>
            {content.title && (
              <Text style={styles.contentTitle}>{content.title}</Text>
            )}
            <Text style={styles.contentText}>{content.content}</Text>
          </View>
        );

      case 'multiple-choice':
        return (
          <View style={styles.questionContent}>
            <Text style={styles.questionText}>{content.question.questionText}</Text>
            <View style={styles.optionsContainer}>
              {content.question.options.map((option, optionIndex) => (
                <TouchableOpacity
                  key={optionIndex}
                  style={[
                    styles.optionButton,
                    selectedAnswers[index] === option && styles.optionButtonSelected
                  ]}
                  onPress={() => handleAnswerSelect(index, option)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedAnswers[index] === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedAnswers[index] && content.question.explanation && (
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationText}>
                  {content.question.explanation}
                </Text>
              </View>
            )}
          </View>
        );

      case 'true-false':
        return (
          <View style={styles.questionContent}>
            <Text style={styles.questionText}>{content.question.questionText}</Text>
            <View style={styles.trueFalseContainer}>
              <TouchableOpacity
                style={[
                  styles.trueFalseButton,
                  selectedAnswers[index] === 'True' && styles.optionButtonSelected
                ]}
                onPress={() => handleAnswerSelect(index, 'True')}
              >
                <Text style={[
                  styles.trueFalseText,
                  selectedAnswers[index] === 'True' && styles.optionTextSelected
                ]}>
                  True
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.trueFalseButton,
                  selectedAnswers[index] === 'False' && styles.optionButtonSelected
                ]}
                onPress={() => handleAnswerSelect(index, 'False')}
              >
                <Text style={[
                  styles.trueFalseText,
                  selectedAnswers[index] === 'False' && styles.optionTextSelected
                ]}>
                  False
                </Text>
              </TouchableOpacity>
            </View>
            {selectedAnswers[index] && content.question.explanation && (
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationText}>
                  {content.question.explanation}
                </Text>
              </View>
            )}
          </View>
        );

      case 'tap-to-reveal':
        return (
          <View style={styles.tapToRevealContent}>
            <Text style={styles.contentTitle}>{content.title}</Text>
            <TouchableOpacity
              style={styles.revealButton}
              onPress={() => handleAnswerSelect(index, true)}
            >
              <Text style={styles.revealButtonText}>
                {selectedAnswers[index] ? 'Hide Answer' : 'Tap to Reveal'}
              </Text>
            </TouchableOpacity>
            {selectedAnswers[index] && (
              <View style={styles.revealedContent}>
                {typeof content.hiddenContent === 'string' ? (
                  <Text style={styles.revealedText}>{content.hiddenContent}</Text>
                ) : (
                  content.hiddenContent.map((item, itemIndex) => (
                    <Text key={itemIndex} style={styles.revealedText}>
                      • {item}
                    </Text>
                  ))
                )}
              </View>
            )}
          </View>
        );

      default:
        return (
          <View style={styles.textContent}>
            <Text style={styles.contentText}>Content type not supported in mobile app</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{lesson.title}</Text>
          <Text style={styles.headerSubtitle}>
            {currentContentIndex + 1} of {lesson.content.length}
          </Text>
        </View>
        <View style={styles.xpContainer}>
          <Icon name="star" size={16} color="#fbbf24" />
          <Text style={styles.xpText}>{lesson.xpReward}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentContentIndex + 1) / lesson.content.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent(currentContent, currentContentIndex)}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.previousButton]}
          onPress={handlePrevious}
          disabled={currentContentIndex === 0}
        >
          <Icon 
            name="chevron-left" 
            size={24} 
            color={currentContentIndex === 0 ? "#d1d5db" : "#6b7280"} 
          />
          <Text style={[
            styles.footerButtonText,
            currentContentIndex === 0 && styles.footerButtonTextDisabled
          ]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isLastContent ? (isCompleted ? 'Review' : 'Complete') : 'Next'}
          </Text>
          <Icon name="chevron-right" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 4,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  textContent: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  contentText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  questionContent: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  optionButtonSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563eb',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#2563eb',
    fontWeight: '600',
  },
  trueFalseContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  trueFalseButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  trueFalseText: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
  },
  explanationContainer: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  explanationText: {
    fontSize: 14,
    color: '#0c4a6e',
    lineHeight: 20,
  },
  tapToRevealContent: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  revealButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  revealButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  revealedContent: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  revealedText: {
    fontSize: 16,
    color: '#0c4a6e',
    lineHeight: 24,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  previousButton: {
    backgroundColor: '#f3f4f6',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 8,
  },
  footerButtonTextDisabled: {
    color: '#d1d5db',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
});