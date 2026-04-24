const knowledgeData = [
  {
    id: "what-is-cad",
    title: "What is Coronary Artery Disease?",
    content: [
      "Coronary Artery Disease (CAD) is a condition where the coronary arteries, which supply blood to the heart muscle, become narrowed or blocked. This is usually caused by a buildup of cholesterol and fatty deposits (called plaque) on the inner walls of the arteries, a process known as atherosclerosis.",
      "Over time, this plaque hardens and restricts blood flow to the heart. When the heart doesn't receive enough oxygen-rich blood, it can lead to chest pain (angina), shortness of breath, or in severe cases a heart attack.",
      "CAD is the most common type of heart disease and is the leading cause of death worldwide according to the World Health Organization. The good news is that many of the risk factors for CAD are modifiable, meaning lifestyle changes can significantly reduce your risk.",
    ],
    quiz: [
      {
        question: "What is the main cause of Coronary Artery Disease?",
        options: [
          "A viral infection in the heart",
          "Buildup of plaque in the coronary arteries",
          "A genetic defect in the heart valves",
          "Excess fluid around the heart",
        ],
        answer: 1,
      },
      {
        question: "What is the process of plaque buildup in arteries called?",
        options: [
          "Arrhythmia",
          "Atherosclerosis",
          "Angioplasty",
          "Aneurysm",
        ],
        answer: 1,
      },
      {
        question: "Which organisation stated that CAD is the leading cause of death worldwide?",
        options: [
          "NHS England",
          "American Heart Association",
          "World Health Organization",
          "British Heart Foundation",
        ],
        answer: 2,
      },
    ],
  },
  {
    id: "risk-factors",
    title: "Risk Factors for CAD",
    content: [
      "Risk factors for Coronary Artery Disease can be split into two categories: modifiable (things you can change) and non-modifiable (things you cannot change).",
      "Non-modifiable risk factors include age, sex and family history. The risk of CAD increases as you get older, and men are generally at higher risk at a younger age than women. If close relatives have had heart disease, your own risk is also elevated.",
      "Modifiable risk factors are where prevention efforts should be focused. These include high blood pressure, high cholesterol, smoking, diabetes, obesity, physical inactivity and an unhealthy diet. According to research by Dai et al (2022), dietary risks and high systolic blood pressure were the leading modifiable factors for ischaemic heart disease, accounting for 69.2% and 54.4% of attributable deaths respectively.",
      "Understanding your personal risk factors is the first step towards prevention. Even small changes to modifiable factors can have a meaningful impact on your overall risk.",
    ],
    quiz: [
      {
        question: "Which of the following is a NON-modifiable risk factor for CAD?",
        options: [
          "Smoking",
          "High cholesterol",
          "Age",
          "Physical inactivity",
        ],
        answer: 2,
      },
      {
        question: "According to Dai et al (2022), which modifiable factor accounted for 69.2% of attributable IHD deaths?",
        options: [
          "Smoking",
          "Dietary risks",
          "Obesity",
          "Diabetes",
        ],
        answer: 1,
      },
      {
        question: "Which of these is a modifiable risk factor?",
        options: [
          "Family history",
          "Sex",
          "Age",
          "High blood pressure",
        ],
        answer: 3,
      },
    ],
  },
  {
    id: "smoking-and-cad",
    title: "Smoking and Heart Disease",
    content: [
      "Smoking is one of the most significant modifiable risk factors for Coronary Artery Disease. The chemicals in tobacco smoke damage the lining of the arteries, making them more susceptible to plaque buildup.",
      "Smoking also raises blood pressure, reduces the amount of oxygen your blood can carry, and makes the blood more likely to clot. All of these effects increase the strain on your heart and accelerate the development of CAD.",
      "The benefits of quitting smoking are substantial and begin almost immediately. Within a year of quitting, the excess risk of heart disease drops to about half that of a continuing smoker. After several years, the risk can approach that of someone who has never smoked.",
    ],
    quiz: [
      {
        question: "How does smoking contribute to CAD?",
        options: [
          "It strengthens the artery walls",
          "It damages the lining of the arteries",
          "It lowers blood pressure",
          "It increases blood oxygen levels",
        ],
        answer: 1,
      },
      {
        question: "What happens within a year of quitting smoking?",
        options: [
          "Heart disease risk drops to zero",
          "Lung capacity doubles",
          "Excess heart disease risk drops to about half",
          "Blood pressure permanently normalises",
        ],
        answer: 2,
      },
    ],
  },
  {
    id: "diet-and-heart",
    title: "Diet and Heart Health",
    content: [
      "What you eat has a direct impact on your risk of developing Coronary Artery Disease. Diets high in saturated fats, trans fats and sodium can raise cholesterol levels and blood pressure, both major contributors to CAD.",
      "A heart-healthy diet focuses on fruits, vegetables, whole grains, lean proteins and healthy fats such as those found in nuts, seeds and oily fish. Reducing processed foods, sugary drinks and excessive salt intake can also make a significant difference.",
      "The Mediterranean diet is often recommended for heart health. It emphasises olive oil, fish, fruits, vegetables, legumes and whole grains while limiting red meat and processed foods. Studies have consistently shown that following this pattern can reduce cardiovascular risk.",
    ],
    quiz: [
      {
        question: "Which type of fat is harmful for heart health?",
        options: [
          "Unsaturated fat",
          "Omega-3 fatty acids",
          "Saturated fat",
          "Monounsaturated fat",
        ],
        answer: 2,
      },
      {
        question: "Which diet is commonly recommended for heart health?",
        options: [
          "Keto diet",
          "Mediterranean diet",
          "Carnivore diet",
          "Juice cleanse",
        ],
        answer: 1,
      },
      {
        question: "Which of these foods is considered heart-healthy?",
        options: [
          "Processed meat",
          "Sugary drinks",
          "Oily fish",
          "Deep fried food",
        ],
        answer: 2,
      },
    ],
  },
  {
    id: "exercise-and-heart",
    title: "Exercise and Heart Health",
    content: [
      "Regular physical activity is one of the most effective ways to reduce your risk of Coronary Artery Disease. Exercise strengthens the heart muscle, improves blood circulation and helps maintain a healthy weight.",
      "The NHS recommends at least 150 minutes of moderate-intensity exercise per week, or 75 minutes of vigorous-intensity exercise. This can include activities like brisk walking, cycling, swimming or jogging.",
      "Exercise also helps manage other risk factors for CAD. It can lower blood pressure, improve cholesterol levels, help control blood sugar in people with diabetes, and reduce stress. Even small amounts of regular activity are better than none at all.",
    ],
    quiz: [
      {
        question: "How many minutes of moderate exercise per week does the NHS recommend?",
        options: [
          "60 minutes",
          "90 minutes",
          "150 minutes",
          "200 minutes",
        ],
        answer: 2,
      },
      {
        question: "Which of the following is NOT a benefit of exercise for heart health?",
        options: [
          "Lowers blood pressure",
          "Increases plaque buildup",
          "Improves cholesterol levels",
          "Helps control blood sugar",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: "blood-pressure",
    title: "Understanding Blood Pressure",
    content: [
      "Blood pressure is the force of blood pushing against the walls of your arteries as the heart pumps it around the body. It is measured using two numbers: systolic (the pressure when the heart beats) and diastolic (the pressure when the heart rests between beats).",
      "A normal blood pressure reading is generally considered to be around 120/80 mmHg. High blood pressure (hypertension) is typically defined as consistently reading 140/90 mmHg or above. Hypertension often has no symptoms, which is why it is sometimes called the 'silent killer'.",
      "High blood pressure forces the heart to work harder and damages the artery walls over time, making them more prone to plaque buildup. Managing blood pressure through diet, exercise, reducing salt intake and medication when necessary is crucial for preventing CAD.",
    ],
    quiz: [
      {
        question: "What does systolic blood pressure measure?",
        options: [
          "Pressure when the heart rests",
          "Pressure when the heart beats",
          "Average pressure over a day",
          "Pressure in the veins",
        ],
        answer: 1,
      },
      {
        question: "What is a normal blood pressure reading?",
        options: [
          "140/90 mmHg",
          "160/100 mmHg",
          "120/80 mmHg",
          "100/60 mmHg",
        ],
        answer: 2,
      },
      {
        question: "Why is hypertension called the 'silent killer'?",
        options: [
          "It only affects elderly people",
          "It often has no symptoms",
          "It cannot be treated",
          "It always leads to a heart attack",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: "cholesterol",
    title: "Understanding Cholesterol",
    content: [
      "Cholesterol is a waxy substance found in your blood. Your body needs cholesterol to build healthy cells, but having high levels of certain types of cholesterol can increase your risk of heart disease.",
      "There are two main types: LDL (low-density lipoprotein), often called 'bad' cholesterol, which contributes to plaque buildup in the arteries, and HDL (high-density lipoprotein), known as 'good' cholesterol, which helps remove LDL from the bloodstream.",
      "High total cholesterol or high LDL levels are significant risk factors for CAD. You can manage cholesterol through a healthy diet (reducing saturated fats), regular exercise, maintaining a healthy weight and, if prescribed by a doctor, medication such as statins.",
    ],
    quiz: [
      {
        question: "Which type of cholesterol is considered 'bad'?",
        options: [
          "HDL",
          "LDL",
          "Triglycerides",
          "Glucose",
        ],
        answer: 1,
      },
      {
        question: "What does HDL cholesterol do?",
        options: [
          "Blocks the arteries",
          "Raises blood pressure",
          "Helps remove LDL from the bloodstream",
          "Increases plaque buildup",
        ],
        answer: 2,
      },
    ],
  },
];

export default knowledgeData;
