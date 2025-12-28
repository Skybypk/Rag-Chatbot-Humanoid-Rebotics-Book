import type {JSX, ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
title: string;
icon: string; // Using emoji icons for robotics theme
description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
{
title: 'AI-Powered Robotics',
icon: '🤖',
description: (
<>
Advanced robotics powered by artificial intelligence and machine learning algorithms. Intelligent systems that adapt and learn from their environment.
</>
),
},
{
title: 'Humanoid Design',
icon: '🦾',
description: (
<>
Sophisticated humanoid design that mimics human movements and interactions. Human-like form factor for natural interaction.
</>
),
},
{
title: 'Open Source',
icon: '🔓',
description: (
<>
Built with open source technologies and community-driven development. Collaborative approach to robotics advancement.
</>
),
},
{
title: 'Advanced Sensors',
icon: '📡',
description: (
<>
Integrated sensor systems for environment perception and interaction. Multiple sensors for comprehensive data collection.
</>
),
},
{
title: 'Machine Learning',
icon: '🧠',
description: (
<>
Intelligent systems that learn and adapt to new situations and environments. Continuous learning and improvement capabilities.
</>
),
},
{
title: 'Human-Robot Interaction',
icon: '🤝',
description: (
<>
Seamless interfaces for natural communication between humans and robots. Intuitive interaction methods and safety protocols.
</>
),
},
];

function Feature({title, icon, description}: FeatureItem) {
return (
<div className={clsx('col col--4')}>
<div className={clsx('card', styles.chapterFeature)}>
<div className="card__header">
<div className={styles.featureIcon}>
{icon}
</div>
<Heading as="h3">{title}</Heading>
</div>
<div className="card__body">
<p>{description}</p>
</div>
</div>
</div>
);
}

export default function HomepageFeatures(): JSX.Element {
return (
<section className={styles.features}>
<div className="container">
<div className="row">
{FeatureList.map((props, idx) => (
<Feature key={idx} {...props} />
))}
</div>
</div>
</section>
);
}
 