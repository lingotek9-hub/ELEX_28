import { GoogleSheetConfig, NominationSubmission } from '../types/nomination';

const SPREADSHEET_TITLE = 'سجل ترشيحات أمانات الدفعة - ELEX28';

export const MAIN_HEADERS = [
  'الطابع الزمني',
  'الاسم الرباعي لمقدّم الطلب',
  'الرقم الجامعي / الأكاديمي',
  'رقم الهاتف / واتساب للتواصل',
  'التقييم العام للرابطة السابقة (من 5)',
  'تقييم الأمانة العامة السابقة (من 5)',
  'تقييم الأمانة الأكاديمية السابقة (من 5)',
  'تقييم الأمانة المالية السابقة (من 5)',
  'تقييم الأمانة الاجتماعية السابقة (من 5)',
  'إيجابيات ومكتسبات الرابطة السابقة',
  'توصيات ونقاط تطوير للرابطة القادمة',
  'الأمانة العامة - نوع الترشيح',
  'الأمانة العامة - اسم المرشح',
  'الأمانة العامة - أسباب ومؤهلات الترشيح',
  'الأمانة الأكاديمية - نوع الترشيح',
  'الأمانة الأكاديمية - اسم المرشح',
  'الأمانة الأكاديمية - أسباب ورؤية التطوير',
  'الأمانة المالية - نوع الترشيح',
  'الأمانة المالية - اسم المرشح',
  'الأمانة المالية - الخبرة والنزاهة الإدارية والمحاسبية',
  'الأمانة الاجتماعية - نوع الترشيح',
  'الأمانة الاجتماعية - اسم المرشح',
  'الأمانة الاجتماعية - أفكار ومبادرات الأنشطة',
  'مقترحات وأفكار إضافية للدفعة',
  'مُعرّف الرد (Response ID)',
];

export const SECRETARIAT_HEADERS = [
  'الطابع الزمني',
  'اسم المرشح',
  'نوع الترشيح',
  'اسم مقدّم الطلب',
  'الرقم الجامعي لمقدّم الطلب',
  'هاتف مقدّم الطلب',
  'الأسباب والمؤهلات والرؤية',
  'معرف الرد',
];

export const EVALUATION_HEADERS = [
  'الطابع الزمني',
  'اسم مقدّم التقييم',
  'الرقم الجامعي',
  'رقم الهاتف',
  'التقييم العام (من 5)',
  'الأمانة العامة (من 5)',
  'ملاحظات الأمانة العامة',
  'الأمانة الأكاديمية (من 5)',
  'ملاحظات الأمانة الأكاديمية',
  'الأمانة المالية (من 5)',
  'ملاحظات الأمانة المالية',
  'الأمانة الاجتماعية (من 5)',
  'ملاحظات الأمانة الاجتماعية',
  'الإيجابيات والمكتسبات',
  'نقاط التطوير والتوصيات',
  'معرف الرد',
];

export async function createGoogleSpreadsheet(accessToken: string): Promise<GoogleSheetConfig> {
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: SPREADSHEET_TITLE,
      },
      sheets: [
        {
          properties: {
            title: 'جميع الردود والترشيحات',
            rightToLeft: true,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
        {
          properties: {
            title: 'تقييم الرابطة السابقة',
            rightToLeft: true,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
        {
          properties: {
            title: 'مرشحو الأمانة العامة',
            rightToLeft: true,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
        {
          properties: {
            title: 'مرشحو الأمانة الأكاديمية',
            rightToLeft: true,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
        {
          properties: {
            title: 'مرشحو الأمانة المالية',
            rightToLeft: true,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
        {
          properties: {
            title: 'مرشحو الأمانة الاجتماعية',
            rightToLeft: true,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message ||
        `فشل في إنشاء جدول بيانات Google Sheets (كود: ${createRes.status})`
    );
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write header rows to all sheets
  const headerData = [
    {
      range: "'جميع الردود والترشيحات'!A1:Y1",
      values: [MAIN_HEADERS],
    },
    {
      range: "'تقييم الرابطة السابقة'!A1:P1",
      values: [EVALUATION_HEADERS],
    },
    {
      range: "'مرشحو الأمانة العامة'!A1:H1",
      values: [SECRETARIAT_HEADERS],
    },
    {
      range: "'مرشحو الأمانة الأكاديمية'!A1:H1",
      values: [SECRETARIAT_HEADERS],
    },
    {
      range: "'مرشحو الأمانة المالية'!A1:H1",
      values: [SECRETARIAT_HEADERS],
    },
    {
      range: "'مرشحو الأمانة الاجتماعية'!A1:H1",
      values: [SECRETARIAT_HEADERS],
    },
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: headerData,
      }),
    }
  );

  return {
    spreadsheetId,
    title: SPREADSHEET_TITLE,
    spreadsheetUrl,
    createdAt: new Date().toISOString(),
    totalSyncedRows: 0,
  };
}

export function submissionToMainRow(submission: NominationSubmission): (string | number)[] {
  const prev = submission.previousEvaluation;
  return [
    submission.timestamp,
    submission.nominatorFullName,
    submission.academicId,
    submission.phoneNumber,
    prev?.overallRating ? `${prev.overallRating} / 5` : 'لم يقيّم',
    prev?.generalSecretariatEval?.rating ? `${prev.generalSecretariatEval.rating} / 5` : '—',
    prev?.academicSecretariatEval?.rating ? `${prev.academicSecretariatEval.rating} / 5` : '—',
    prev?.financialSecretariatEval?.rating ? `${prev.financialSecretariatEval.rating} / 5` : '—',
    prev?.socialSecretariatEval?.rating ? `${prev.socialSecretariatEval.rating} / 5` : '—',
    prev?.positivePoints || '',
    prev?.improvementPoints || '',
    submission.generalSecretariat?.nominationType || '',
    submission.generalSecretariat?.candidateName || '',
    submission.generalSecretariat?.reasonsAndQualifications || '',
    submission.academicSecretariat?.nominationType || '',
    submission.academicSecretariat?.candidateName || '',
    submission.academicSecretariat?.reasonsAndQualifications || '',
    submission.financialSecretariat?.nominationType || '',
    submission.financialSecretariat?.candidateName || '',
    submission.financialSecretariat?.reasonsAndQualifications || '',
    submission.socialSecretariat?.nominationType || '',
    submission.socialSecretariat?.candidateName || '',
    submission.socialSecretariat?.reasonsAndQualifications || '',
    submission.additionalFeedback || '',
    submission.responseId || submission.id || '',
  ];
}

export async function fetchExistingResponseIds(
  accessToken: string,
  spreadsheetId: string
): Promise<Set<string>> {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'جميع الردود والترشيحات'!Y2:Y`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) return new Set();
    const data = await res.json();
    const values = data.values || [];
    return new Set(values.map((v: any[]) => v[0]).filter(Boolean));
  } catch {
    return new Set();
  }
}

export async function appendSubmissionsToSheet(
  accessToken: string,
  spreadsheetId: string,
  submissions: NominationSubmission[]
): Promise<number> {
  if (submissions.length === 0) return 0;

  // Check existing to prevent duplicates
  const existingIds = await fetchExistingResponseIds(accessToken, spreadsheetId);
  const newSubmissions = submissions.filter(
    (s) => !existingIds.has(s.responseId || s.id || '')
  );

  if (newSubmissions.length === 0) return 0;

  // 1. Append to main sheet
  const mainRows = newSubmissions.map(submissionToMainRow);
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'جميع الردود والترشيحات'!A:Y:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: mainRows,
      }),
    }
  );

  // 2. Append to Evaluation Sheet if evaluation is present
  const evalRows = newSubmissions
    .filter((s) => s.previousEvaluation && s.previousEvaluation.overallRating > 0)
    .map((s) => {
      const p = s.previousEvaluation!;
      return [
        s.timestamp,
        s.nominatorFullName,
        s.academicId,
        s.phoneNumber,
        `${p.overallRating} نجوم`,
        p.generalSecretariatEval?.rating ? `${p.generalSecretariatEval.rating} نجوم` : '—',
        p.generalSecretariatEval?.notes || '',
        p.academicSecretariatEval?.rating ? `${p.academicSecretariatEval.rating} نجوم` : '—',
        p.academicSecretariatEval?.notes || '',
        p.financialSecretariatEval?.rating ? `${p.financialSecretariatEval.rating} نجوم` : '—',
        p.financialSecretariatEval?.notes || '',
        p.socialSecretariatEval?.rating ? `${p.socialSecretariatEval.rating} نجوم` : '—',
        p.socialSecretariatEval?.notes || '',
        p.positivePoints || '',
        p.improvementPoints || '',
        s.responseId || s.id || '',
      ];
    });

  if (evalRows.length > 0) {
    try {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'تقييم الرابطة السابقة'!A:P:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: evalRows,
          }),
        }
      );
    } catch (err) {
      console.warn('Could not append to evaluation sheet tab:', err);
    }
  }

  // 3. Append to specific secretariat sheets if nominated
  const appendSecretariat = async (sheetName: string, getField: (s: NominationSubmission) => any) => {
    const rows = newSubmissions
      .filter((s) => {
        const item = getField(s);
        return item && item.candidateName && item.nominationType !== 'لا يوجد ترشيح';
      })
      .map((s) => {
        const item = getField(s);
        return [
          s.timestamp,
          item.candidateName,
          item.nominationType,
          s.nominatorFullName,
          s.academicId,
          s.phoneNumber,
          item.reasonsAndQualifications,
          s.responseId || s.id || '',
        ];
      });

    if (rows.length > 0) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${sheetName}'!A:H:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: rows,
          }),
        }
      );
    }
  };

  await Promise.all([
    appendSecretariat('مرشحو الأمانة العامة', (s) => s.generalSecretariat),
    appendSecretariat('مرشحو الأمانة الأكاديمية', (s) => s.academicSecretariat),
    appendSecretariat('مرشحو الأمانة المالية', (s) => s.financialSecretariat),
    appendSecretariat('مرشحو الأمانة الاجتماعية', (s) => s.socialSecretariat),
  ]);

  return newSubmissions.length;
}
