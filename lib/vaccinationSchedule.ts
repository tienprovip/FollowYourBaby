export interface VaccineItem {
  id: string;
  name: string;
  shortName: string;
  ageMonths: number;
  description: string;
}

export const VIETNAM_EPI_SCHEDULE: VaccineItem[] = [
  {
    id: 'bcg',
    name: 'BCG (Lao)',
    shortName: 'BCG',
    ageMonths: 0,
    description: 'Tiêm phòng lao sơ sinh',
  },
  {
    id: 'hepb_0',
    name: 'Viêm gan B (liều sơ sinh)',
    shortName: 'Viêm gan B',
    ageMonths: 0,
    description: 'Tiêm trong vòng 24h sau sinh',
  },
  {
    id: 'pentavalent_1',
    name: '5-trong-1 (DPT-VGB-Hib) liều 1',
    shortName: '5-trong-1 (1)',
    ageMonths: 2,
    description: 'Bạch hầu, Ho gà, Uốn ván, Viêm gan B, Hib',
  },
  {
    id: 'ipv_1',
    name: 'Bại liệt IPV liều 1',
    shortName: 'IPV (1)',
    ageMonths: 2,
    description: 'Vắc-xin bại liệt bất hoạt',
  },
  {
    id: 'pentavalent_2',
    name: '5-trong-1 (DPT-VGB-Hib) liều 2',
    shortName: '5-trong-1 (2)',
    ageMonths: 3,
    description: 'Bạch hầu, Ho gà, Uốn ván, Viêm gan B, Hib',
  },
  {
    id: 'ipv_2',
    name: 'Bại liệt IPV liều 2',
    shortName: 'IPV (2)',
    ageMonths: 3,
    description: 'Vắc-xin bại liệt bất hoạt',
  },
  {
    id: 'pentavalent_3',
    name: '5-trong-1 (DPT-VGB-Hib) liều 3',
    shortName: '5-trong-1 (3)',
    ageMonths: 4,
    description: 'Bạch hầu, Ho gà, Uốn ván, Viêm gan B, Hib',
  },
  {
    id: 'ipv_3',
    name: 'Bại liệt IPV liều 3',
    shortName: 'IPV (3)',
    ageMonths: 4,
    description: 'Vắc-xin bại liệt bất hoạt',
  },
  {
    id: 'measles_1',
    name: 'Sởi liều 1',
    shortName: 'Sởi (1)',
    ageMonths: 9,
    description: 'Vắc-xin phòng bệnh sởi',
  },
  {
    id: 'mmr',
    name: 'Sởi - Quai bị - Rubella (MMR)',
    shortName: 'MMR',
    ageMonths: 12,
    description: 'Tiêm nhắc phòng Sởi, Quai bị, Rubella',
  },
  {
    id: 'je_1',
    name: 'Viêm não Nhật Bản liều 1',
    shortName: 'VNNB (1)',
    ageMonths: 12,
    description: 'Phòng viêm não Nhật Bản',
  },
  {
    id: 'je_2',
    name: 'Viêm não Nhật Bản liều 2',
    shortName: 'VNNB (2)',
    ageMonths: 13,
    description: 'Phòng viêm não Nhật Bản (1 tuần sau liều 1)',
  },
  {
    id: 'je_3',
    name: 'Viêm não Nhật Bản liều 3',
    shortName: 'VNNB (3)',
    ageMonths: 24,
    description: 'Nhắc lại sau 1 năm',
  },
];

export interface ScheduledVaccine extends VaccineItem {
  dueDate: Date;
  isOverdue: boolean;
  isUpcoming: boolean;
  daysUntilDue: number;
}

export function getVaccinationSchedule(birthDate: Date): ScheduledVaccine[] {
  const now = new Date();

  return VIETNAM_EPI_SCHEDULE.map((vaccine) => {
    const dueDate = new Date(birthDate);
    dueDate.setMonth(dueDate.getMonth() + vaccine.ageMonths);

    const msUntilDue = dueDate.getTime() - now.getTime();
    const daysUntilDue = Math.ceil(msUntilDue / (1000 * 60 * 60 * 24));
    const isOverdue = daysUntilDue < 0;
    const isUpcoming = daysUntilDue >= 0 && daysUntilDue <= 30;

    return {
      ...vaccine,
      dueDate,
      isOverdue,
      isUpcoming,
      daysUntilDue,
    };
  });
}

export function getUpcomingVaccinations(
  birthDate: Date,
  withinDays = 30,
): ScheduledVaccine[] {
  return getVaccinationSchedule(birthDate).filter(
    (v) => v.daysUntilDue >= 0 && v.daysUntilDue <= withinDays,
  );
}
