// Client-side translation service using browser APIs
// This will handle translation without requiring backend services

interface TranslateBookResponse {
  success: boolean;
  message: string;
  translated_content_url?: string;
}

interface QueryResponse {
  answer: string;
  sources: string[];
  confidence: number;
}

// Mock book content for search and translation
const BOOK_CONTENT = {
  '01-introduction-to-physical-ai.md': {
    title: 'Introduction to Physical AI',
    content: `Physical AI is an interdisciplinary field that combines artificial intelligence with robotics. It focuses on creating intelligent systems that can interact with the physical world effectively. This field encompasses machine learning, computer vision, robotics, and control systems.`
  },
  '02-foundations-of-robotics.md': {
    title: 'Foundations of Robotics: Systems, Structure & Core Mechanisms',
    content: `Robotics is the branch of technology that deals with the design, construction, operation, and application of robots. It closely relates to AI, as robots often require intelligent behavior to perform their tasks effectively. The core components of a robotic system include sensors for perception, actuators for movement, and controllers for decision-making.`
  },
  '03-human-inspired-design-principles.md': {
    title: 'Human-Inspired Design Principles',
    content: `Human-inspired design in robotics draws from biological systems to create more effective and intuitive robotic solutions. This approach, also known as biomimetics, looks at how humans and animals solve problems and applies these principles to robot design.`
  },
  '04-perception-systems.md': {
    title: 'Perception Systems',
    content: `Perception systems in robotics enable robots to understand their environment through various sensors. These systems process data from cameras, lidar, radar, and other sensors to build a representation of the world around them.`
  },
  '05-ai-deep-learning-and-control.md': {
    title: 'AI, Deep Learning and Control',
    content: `The integration of AI and deep learning techniques has revolutionized robotic control systems. These approaches allow robots to learn from experience, adapt to new situations, and perform complex tasks that were previously impossible with traditional programming methods.`
  },
  '06-locomotion-and-manipulation.md': {
    title: 'Locomotion and Manipulation',
    content: `Locomotion and manipulation are fundamental capabilities for physical AI systems. Locomotion refers to the ability to move through an environment, while manipulation involves interacting with objects.`
  }
};

// Simple English to Urdu translation
const translateToUrdu = (text: string): string => {
  // This is a basic translation function that will be enhanced
  // For now, we'll return a more realistic mock translation
  // In a real implementation, this would connect to a translation API
  const englishToUrduMap: { [key: string]: string } = {
    'Humanoid': 'ہیومنوائڈ',
    'Robotics': 'روبوٹکس',
    'Introduction': 'تعارف',
    'Foundations': 'اداروں',
    'Design': 'ڈیزائن',
    'Principles': 'اصول',
    'Perception': 'ادراک',
    'Systems': 'سسٹم',
    'AI': 'مصنوعی ذہانت',
    'Deep': 'گہرا',
    'Learning': 'سیکھنا',
    'Control': 'کنٹرول',
    'Locomotion': 'حرکت',
    'Manipulation': 'ہیرا پھیری',
    'Artificial': 'مصنوعی',
    'Intelligence': 'ذہانت',
    'Physical': 'جسمانی',
    'Interdisciplinary': ' interdisciplinary',
    'Field': 'میدان',
    'Machine': 'مشین',
    'Vision': 'دید',
    'Sensors': 'سینسرز',
    'Actuators': 'ایکچوایٹرز',
    'Controllers': 'کنٹرولرز',
    'Decision': 'فیصلہ',
    'Biomimetics': 'بائیو میمیٹکس',
    'Environment': 'ماحول',
    'Lidar': 'لیڈار',
    'Radar': 'ریڈار',
    'Integration': 'انضمام',
    'Experience': 'تجربہ',
    'Complex': 'پیچیدہ',
    'Traditional': 'روایتی',
    'Programming': 'پروگرامنگ',
    'Methods': 'طریقے',
    'Fundamental': 'اہم',
    'Capabilities': 'صلاحیتیں',
    'Movement': 'حرکت',
    'Interact': ' interaction',
    'Objects': 'اشیاء',
    'Humanoid Robotics Book': 'ہیومنوائڈ روبوٹکس کتاب',
    'A complete and practical learning system': 'ایک مکمل اور عملی سیکھنے کا نظام',
    'where you master the future AI': 'جہاں آپ مستقبل کی مصنوعی ذہانت کے ماسٹر بنیں',
    'for next-generation intelligent machines': 'اگلی نسل کی سمجھدار مشینوں کے لیے',
    'Physical AI': 'جسمانی مصنوعی ذہانت',
    'Robotics is the branch of technology': 'روبوٹکس ٹیکنالوجی کی ایک شاخ ہے',
    'that deals with the design': 'جس سے ڈیزائن کا سامنا ہوتا ہے',
    'construction': 'تعمیر',
    'operation': 'کارروائی',
    'and application of robots': 'اور روبوٹس کی درخواست',
    'Core components': 'مرکزی اجزاء',
    'include sensors for perception': 'ادراک کے لیے سینسرز شامل ہیں',
    'for decision-making': 'فیصلہ سازی کے لیے'
  };

  let translatedText = text;
  for (const [english, urdu] of Object.entries(englishToUrduMap)) {
    // Replace case-insensitively to handle different cases
    const regex = new RegExp(english, 'gi');
    translatedText = translatedText.replace(regex, (match) => {
      // Preserve the original case
      if (match === match.toUpperCase()) {
        return urdu.toUpperCase();
      } else if (match === match.toLowerCase()) {
        return urdu.toLowerCase();
      } else if (match[0] === match[0].toUpperCase()) {
        return urdu.charAt(0).toUpperCase() + urdu.slice(1).toLowerCase();
      }
      return urdu;
    });
  }

  // For any remaining text that wasn't translated, we can keep it in English
  // or use a more sophisticated approach in a real implementation
  return translatedText;
};

export const clientApi = {
  // Health check - always return true for client-side
  async healthCheck(): Promise<boolean> {
    return Promise.resolve(true);
  },

  // Search functionality using client-side content
  async searchBook(query: string, user_id?: string, language: string = 'en'): Promise<QueryResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
        const results: string[] = [];

        for (const [filename, data] of Object.entries(BOOK_CONTENT)) {
          const content = `${data.title} ${data.content}`.toLowerCase();
          let matchCount = 0;

          for (const term of searchTerms) {
            if (content.includes(term.toLowerCase())) {
              matchCount++;
            }
          }

          if (matchCount > 0) {
            results.push(`${data.title}: ${data.content.substring(0, 200)}...`);
          }
        }

        if (results.length > 0) {
          resolve({
            answer: results[0],
            sources: results.slice(0, 3), // Return top 3 results
            confidence: 0.8
          });
        } else {
          resolve({
            answer: "No content found in the book for your query.",
            sources: [],
            confidence: 0
          });
        }
      }, 300);
    });
  },

  // Translation functionality using client-side processing
  async translateBook(target_language: string, user_id?: string): Promise<TranslateBookResponse> {
    return new Promise(async (resolve) => {
      if (target_language.toLowerCase() !== 'ur') {
        resolve({
          success: false,
          message: "Only Urdu translation is supported in client-side mode"
        });
        return;
      }

      // Simulate translation process taking some time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create a translated version of the book content
      const translatedContent: { [key: string]: any } = {};

      for (const [filename, data] of Object.entries(BOOK_CONTENT)) {
        // Apply translation function to content and title
        const translatedContentText = translateToUrdu(data.content);
        const translatedTitle = translateToUrdu(data.title);

        translatedContent[filename] = {
          title: translatedTitle,
          content: translatedContentText
        };
      }

      // Save translated content to localStorage so it can be accessed later
      try {
        localStorage.setItem(`translated_content_${target_language}`, JSON.stringify(translatedContent));

        // Indicate success with a more specific message
        resolve({
          success: true,
          message: `Book translated to ${target_language.toUpperCase()} successfully. ${Object.keys(translatedContent).length} sections translated. Refresh the page to see changes.`,
          translated_content_url: `/docs/${target_language}` // This would be the path to access translated docs
        });
      } catch (error) {
        console.error('Error saving translated content:', error);
        resolve({
          success: true,
          message: `Book translated to ${target_language.toUpperCase()} successfully, but could not save to browser storage. ${Object.keys(translatedContent).length} sections translated.`,
          translated_content_url: `/docs/${target_language}`
        });
      }
    });
  }
};