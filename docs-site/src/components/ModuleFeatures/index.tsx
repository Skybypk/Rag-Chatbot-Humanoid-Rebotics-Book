import type { JSX, ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';



// ✅ Type for each card
type ModuleItem = {
  title: string;
  description: ReactNode;
  to: string;
  icon?: string;
};

// ✅ Card data
const ModuleList: ModuleItem[] = [
  {
    title: 'Introduction to Physical AI',
    to: '/docs/01-introduction-to-physical-ai', // proper docs path
    icon: '🤖',
    description: (
      <>
        Explore the foundational concepts of Physical AI, understanding how artificial intelligence is integrated into robotic systems for real-world interaction.
      </>
    ),
  },
  {
    title: 'Foundations of Robotics: Systems, Structure & Core Mechanisms',
    to: '/docs/02-foundations-of-robotics',
    icon: '⚙️',
    description: (
      <>
        Delve into the fundamental principles of robotics, focusing on the systems, structures, and core mechanisms that form the physical basis of any robotic system.
      </>
    ),
  },
  {
    title: 'Human-Inspired Design Principles',
    to: '/docs/03-human-inspired-design-principles',
    icon: '🧠',
    description: (
      <>
        Discover how human-inspired design principles guide the development of more intuitive and effective robotic systems.
      </>
    ),
  },
  {
    title: 'Perception Systems',
    to: '/docs/04-perception-systems',
    icon: '👁️',
    description: (
      <>
        Learn about perception systems that allow robots to sense and interpret their environment, recognize objects, and navigate safely.
      </>
    ),
  },
  {
    title: 'AI, Deep Learning and Control',
    to: '/docs/05-ai-deep-learning-and-control',
    icon: '🕹️',
    description: (
      <>
        Understand how AI and deep learning techniques enable sophisticated control systems for robotic applications.
      </>
    ),
  },
  {
    title: 'Locomotion and Manipulation',
    to: '/docs/06-locomotion-and-manipulation',
    icon: '🤝',
    description: (
      <>
        Explore the mechanics and control strategies for robot movement and object manipulation in various environments.
      </>
    ),
  },
  // مزید cards اسی structure میں add کریں
];

// ✅ Single card component (internal)
function Module({ title, description, to, icon }: ModuleItem) {
  return (
    <div className={clsx('col col--4', styles.cardLink)}>
      <article className={clsx('card', styles.card)}>
        <div className="card__header">
          <Heading as="h3">
            {icon && <span className={styles.cardIcon}>{icon}</span>} {title}
          </Heading>
        </div>
        <div className="card__body">{description}</div>
      </article>
    </div>
  );
}

// ✅ Export default so import is easy
export default function ModuleFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {ModuleList.map((props, idx) => (
            <Module key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
 