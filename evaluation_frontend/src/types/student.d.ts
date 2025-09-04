export default interface students {
  rollNumber: string;
  isSelected: boolean;
  email: string;
  marks: {
    ideation: number | null;
    execution: number | null;
    viva_pitch: number | null;
  };
}
