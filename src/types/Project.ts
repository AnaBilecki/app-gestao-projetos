export interface Project {
    id: number;
    name: string;
    customerId: number;
    customerName?: string;
    startDate: string | null;
    endDate: string | null;
    deadline: number;
    steps?: ProjectStep[];
}

export interface ProjectStep {
    id: number;
    stepId: number;
    projectId: number;
    completed: boolean;
    name: string;
    description?: string;
    stepOrder?: number;
}