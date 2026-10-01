import { GoogleFormConfig, NominationSubmission } from '../types/nomination';

const FORM_TITLE = 'استمارة الترشح والترشيح لأمانات الدفعة';
const FORM_DESCRIPTION =
  'مرحباً بكم يا دفعة، هذه الاستمارة مخصصة لفتح باب الترشح والترشيح لانتخابات أمانات الدفعة القادمة. يمكنك ترشيح نفسك أو ترشيح من تراه مناسباً وكفؤاً لشغل الأمانات المختلفة. نرجو ملء البيانات بدقة لضمان الشفافية.';

export async function createGoogleForm(accessToken: string): Promise<GoogleFormConfig> {
  // Step 1: Create initial form
  const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title: FORM_TITLE,
        documentTitle: FORM_TITLE,
      },
    }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `فشل في إنشاء استمارة Google Form (كود: ${createRes.status})`
    );
  }

  const formData = await createRes.json();
  const formId = formData.formId;

  // Step 2: Batch update form items (questions, descriptions, choices)
  const itemsToCreate = [
    // Description Update handled in requests[0]
    // 0: Nominator Info Header
    {
      title: 'بيانات مقدّم الطلب (Voter / Nominator Information)',
      description: 'يرجى إدخال بياناتك الأكاديمية والشخصية بدقة للتحقق من العضوية وضمان نزاهة الترشيحات.',
      textItem: {},
    },
    // 1: الاسم الرباعي
    {
      title: 'الاسم الرباعي',
      description: 'يرجى كتابة اسمك الرباعي كاملاً كما هو مدون في السجلات الجامعية الرسمية.',
      questionItem: {
        question: {
          required: true,
          textQuestion: {
            paragraph: false,
          },
        },
      },
    },
    // 2: الرقم الجامعي / الأكاديمي
    {
      title: 'الرقم الجامعي / الأكاديمي',
      description: 'رقم القيد الأكاديمي أو رقم البطاقة الجامعية للطالب.',
      questionItem: {
        question: {
          required: true,
          textQuestion: {
            paragraph: false,
          },
        },
      },
    },
    // 3: رقم الهاتف / واتساب للتواصل
    {
      title: 'رقم الهاتف / واتساب للتواصل',
      description: 'رقم الهاتف الفعّال مسبوقاً برمز الدولة إن لزم للتواصل السريع والتحقق.',
      questionItem: {
        question: {
          required: true,
          textQuestion: {
            paragraph: false,
          },
        },
      },
    },
    // 4: Section Break: General Secretariat
    {
      title: 'أولاً: الأمانة العامة (منصب الأمين العام)',
      description: 'الأمين العام يمثل الواجهة القيادية والإدارية للدفعة، ويشرف على التنسيق بين كافة الأمانات وإدارة شؤون الدفعة وتمثيلها أمام عمادة الكلية وإدارة الجامعة.',
      pageBreakItem: {},
    },
    // 5: نوع الترشيح - الأمانة العامة
    {
      title: 'الأمانة العامة - نوع الترشيح',
      description: 'حدد ما إذا كنت تود ترشيح نفسك، أو ترشيح زميل كفء، أو عدم تقديم ترشيح لهذا المنصب.',
      questionItem: {
        question: {
          required: true,
          choiceQuestion: {
            type: 'RADIO',
            options: [
              { value: 'ترشيح نفسي' },
              { value: 'ترشيح زميل آخر' },
              { value: 'لا يوجد ترشيح' },
            ],
          },
        },
      },
    },
    // 6: اسم المرشح - الأمانة العامة
    {
      title: 'الأمانة العامة - اسم المرشح الثلاثي / الرباعي',
      description: 'في حال اخترت ترشيح نفسي أو ترشيح زميل، اكتب الاسم كاملاً. اترك الحقل فارغاً في حال "لا يوجد ترشيح".',
      questionItem: {
        question: {
          required: false,
          textQuestion: {
            paragraph: false,
          },
        },
      },
    },
    // 7: أسباب ومؤهلات - الأمانة العامة
    {
      title: 'الأمانة العامة - أسباب ومؤهلات الترشيح',
      description: 'اذكر المهارات القيادية، الخبرات السابقة، والرؤية العامة لإدارة شؤون الدفعة وتحقيق مصالحها.',
      questionItem: {
        question: {
          required: false,
          textQuestion: {
            paragraph: true,
          },
        },
      },
    },
    // 8: Section Break: Academic Secretariat
    {
      title: 'ثانياً: الأمانة الأكاديمية',
      description: 'الأمانة المسؤولة عن تنسيق الشؤون الدراسية، متابعة الجداول والمحاضرات، تذليل العقبات الأكاديمية مع أعضاء هيئة التدريس، وتوفير المراجع والملخصات العلمية.',
      pageBreakItem: {},
    },
    // 9: نوع الترشيح - الأمانة الأكاديمية
    {
      title: 'الأمانة الأكاديمية - نوع الترشيح',
      description: 'حدد خيار الترشيح المناسب للأمانة الأكاديمية.',
      questionItem: {
        question: {
          required: true,
          choiceQuestion: {
            type: 'RADIO',
            options: [
              { value: 'ترشيح نفسي' },
              { value: 'ترشيح زميل آخر' },
              { value: 'لا يوجد ترشيح' },
            ],
          },
        },
      },
    },
    // 10: اسم المرشح - الأمانة الأكاديمية
    {
      title: 'الأمانة الأكاديمية - اسم المرشح الثلاثي / الرباعي',
      description: 'اسم المرشح الموصى به لشغل مهام الأمانة الأكاديمية.',
      questionItem: {
        question: {
          required: false,
          textQuestion: {
            paragraph: false,
          },
        },
      },
    },
    // 11: أسباب ورؤية - الأمانة الأكاديمية
    {
      title: 'الأمانة الأكاديمية - أسباب ومؤهلات الترشيح ورؤيته لتطوير الجانب الأكاديمي',
      description: 'الخبرة الأكاديمية والتواصل مع الأقسام العلمية، وخطة المرشح لخدمة وتطوير المستوى العلمي للدفعة.',
      questionItem: {
        question: {
          required: false,
          textQuestion: {
            paragraph: true,
          },
        },
      },
    },
    // 12: Section Break: Financial Secretariat
    {
      title: 'ثالثاً: الأمانة المالية (أمين المال)',
      description: 'الأمانة المعنية بإدارة صندوق مالية الدفعة، ضبط الإيرادات والمصروفات والاشتراكات، والالتزام بأعلى معايير النزاهة والشفافية وتقديم تقارير محاسبية واضحة.',
      pageBreakItem: {},
    },
    // 13: نوع الترشيح - الأمانة المالية
    {
      title: 'الأمانة المالية - نوع الترشيح',
      description: 'حدد خيار الترشيح المناسب لمنصب أمين المال.',
      questionItem: {
        question: {
          required: true,
          choiceQuestion: {
            type: 'RADIO',
            options: [
              { value: 'ترشيح نفسي' },
              { value: 'ترشيح زميل آخر' },
              { value: 'لا يوجد ترشيح' },
            ],
          },
        },
      },
    },
    // 14: اسم المرشح - الأمانة المالية
    {
      title: 'الأمانة المالية - اسم المرشح الثلاثي / الرباعي',
      description: 'اسم المرشح الموصى به لشغل منصب أمين المال.',
      questionItem: {
        question: {
          required: false,
          textQuestion: {
            paragraph: false,
          },
        },
      },
    },
    // 15: الخبرة والنزاهة - الأمانة المالية
    {
      title: 'الأمانة المالية - أسباب الترشيح والخبرة الإدارية أو المحاسبية',
      description: 'ما يميز المرشح من أمانة ودقة، والخبرات الحسابية أو الإدارية لضمان حسن إدارة الموارد المالية.',
      questionItem: {
        question: {
          required: false,
          textQuestion: {
            paragraph: true,
          },
        },
      },
    },
    // 16: Section Break: Social Secretariat
    {
      title: 'رابعاً: الأمانة الاجتماعية',
      description: 'الأمانة المسؤولة عن المبادرات والمناسبات الاجتماعية، تعزيز التكافل والتضامن بين أفراد الدفعة، وتنظيم الفعاليات الأخوية والثقافية والترفيهية.',
      pageBreakItem: {},
    },
    // 17: نوع الترشيح - الأمانة الاجتماعية
    {
      title: 'الأمانة الاجتماعية - نوع الترشيح',
      description: 'حدد خيار الترشيح المناسب للأمانة الاجتماعية.',
      questionItem: {
        question: {
          required: true,
          choiceQuestion: {
            type: 'RADIO',
            options: [
              { value: 'ترشيح نفسي' },
              { value: 'ترشيح زميل آخر' },
              { value: 'لا يوجد ترشيح' },
            ],
          },
        },
      },
    },
    // 18: اسم المرشح - الأمانة الاجتماعية
    {
      title: 'الأمانة الاجتماعية - اسم المرشح الثلاثي / الرباعي',
      description: 'اسم المرشح الموصى به للأمانة الاجتماعية.',
      questionItem: {
        question: {
          required: false,
          textQuestion: {
            paragraph: false,
          },
        },
      },
    },
    // 19: أفكار الأنشطة - الأمانة الاجتماعية
    {
      title: 'الأمانة الاجتماعية - أسباب الترشيح والأفكار المقترحة للأنشطة والترابط الاجتماعي',
      description: 'الأفكار والمبادرات الإبداعية التي يقترحها المرشح لتوطيد العلاقات والعمل الاجتماعي التكافلي بين الزملاء.',
      questionItem: {
        question: {
          required: false,
          textQuestion: {
            paragraph: true,
          },
        },
      },
    },
    // 20: Section Break: Final Notes
    {
      title: 'خامساً: ملاحظات ومقترحات إضافية للجنة التسيير',
      description: 'مساحة حرة لتقديم أي آراء أو مقترحات تسهم في إنجاح أعمال لجنة تسيير الدفعة ومسيرتها المستقبلية.',
      pageBreakItem: {},
    },
    // 21: مقترحات إضافية
    {
      title: 'هل لديك أي مقترحات أو أفكار للجنة تسيير الدفعة القادمة؟',
      description: 'اكتب مقترحاتك أو توصياتك أو ملاحظاتك العامة بحرية تامة (حقل اختياري).',
      questionItem: {
        question: {
          required: false,
          textQuestion: {
            paragraph: true,
          },
        },
      },
    },
  ];

  const requests: any[] = [
    {
      updateFormInfo: {
        info: {
          description: FORM_DESCRIPTION,
        },
        updateMask: 'description',
      },
    },
  ];

  // Append items in order
  itemsToCreate.forEach((item, index) => {
    requests.push({
      createItem: {
        item,
        location: {
          index,
        },
      },
    });
  });

  const batchRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests,
      includeFormInResponse: true,
    }),
  });

  if (!batchRes.ok) {
    const errorData = await batchRes.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message ||
        `فشل في إضافة أسئلة الاستمارة (كود: ${batchRes.status})`
    );
  }

  const updatedForm = await batchRes.json();
  const responderUri =
    updatedForm?.form?.responderUri ||
    formData.responderUri ||
    `https://docs.google.com/forms/d/e/${formId}/viewform`;
  const editUrl = `https://docs.google.com/forms/d/${formId}/edit`;

  return {
    formId,
    title: FORM_TITLE,
    description: FORM_DESCRIPTION,
    editUrl,
    responderUri,
    createdAt: new Date().toISOString(),
  };
}

export async function getFormDetails(accessToken: string, formId: string) {
  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`تعذر جلب تفاصيل الاستمارة: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchFormResponses(
  accessToken: string,
  formId: string
): Promise<NominationSubmission[]> {
  // First fetch the form definition to map question IDs to fields
  const formDetails = await getFormDetails(accessToken, formId);
  const items = formDetails.items || [];

  const questionMap: { [questionId: string]: string } = {};
  items.forEach((item: any) => {
    if (item.questionItem?.question?.questionId) {
      questionMap[item.questionItem.question.questionId] = item.title;
    }
  });

  // Fetch responses
  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `تعذر جلب ردود الاستمارة (كود: ${res.status})`
    );
  }

  const data = await res.json();
  const responses = data.responses || [];

  // Parse each response into NominationSubmission structure
  return responses.map((resp: any) => {
    const answers = resp.answers || {};

    const findAnswer = (matchSubstring: string): string => {
      for (const [qId, ansObj] of Object.entries(answers) as [string, any][]) {
        const title = questionMap[qId] || '';
        if (title.includes(matchSubstring)) {
          const textAnswers = ansObj.textAnswers?.answers;
          if (textAnswers && textAnswers.length > 0) {
            return textAnswers.map((a: any) => a.value).join(', ');
          }
        }
      }
      return '';
    };

    const submission: NominationSubmission = {
      responseId: resp.responseId,
      timestamp: resp.createTime || new Date().toISOString(),
      nominatorFullName: findAnswer('الاسم الرباعي'),
      academicId: findAnswer('الرقم الجامعي'),
      phoneNumber: findAnswer('رقم الهاتف'),
      generalSecretariat: {
        nominationType: (findAnswer('الأمانة العامة - نوع الترشيح') as any) || '',
        candidateName: findAnswer('الأمانة العامة - اسم المرشح'),
        reasonsAndQualifications: findAnswer('الأمانة العامة - أسباب'),
      },
      academicSecretariat: {
        nominationType: (findAnswer('الأمانة الأكاديمية - نوع الترشيح') as any) || '',
        candidateName: findAnswer('الأمانة الأكاديمية - اسم المرشح'),
        reasonsAndQualifications: findAnswer('الأمانة الأكاديمية - أسباب'),
      },
      financialSecretariat: {
        nominationType: (findAnswer('الأمانة المالية - نوع الترشيح') as any) || '',
        candidateName: findAnswer('الأمانة المالية - اسم المرشح'),
        reasonsAndQualifications: findAnswer('الأمانة المالية - أسباب'),
      },
      socialSecretariat: {
        nominationType: (findAnswer('الأمانة الاجتماعية - نوع الترشيح') as any) || '',
        candidateName: findAnswer('الأمانة الاجتماعية - اسم المرشح'),
        reasonsAndQualifications: findAnswer('الأمانة الاجتماعية - أسباب'),
      },
      additionalFeedback: findAnswer('مقترحات أو أفكار'),
    };

    return submission;
  });
}
