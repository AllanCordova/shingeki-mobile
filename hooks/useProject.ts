import apiClient, { registerUnauthorizedHandler } from "@/lib/api";
import { getAxiosErrorMessage } from "@/lib/http";
import { getApiSuccessMessage } from "@/lib/toastMessages";
import {
  createProjectSchema,
  type CreateProjectInput,
  type Project,
  updateProjectSchema,
  type UpdateProjectInput,
} from "@/schemas/project";
import { toast } from "@/hooks/useToast";
import { ZodError } from "zod";
import { create } from "zustand";

interface ProjectsResponse {
  message: string;
  projects: Project[];
}

interface ProjectResponse {
  message: string;
  project: Project;
}

interface ProjcetState {
  Project: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  error: string | null;
  detailError: string | null;
  submitError: string | null;

  getAllProjects: () => Promise<boolean>;
  getProjectById: (id: string) => Promise<boolean>;
  createProject: (data: CreateProjectInput) => Promise<boolean>;
  updateProject: (id: string, data: UpdateProjectInput) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  clearSelectedProject: () => void;
  clearSubmitError: () => void;
}

function getValidationError(err: unknown, fallback: string): string {
  if (err instanceof ZodError) {
    return err.issues[0]?.message ?? fallback;
  }
  return getAxiosErrorMessage(err, fallback);
}

export const useProject = create<ProjcetState>((set) => ({
  Project: [],
  selectedProject: null,
  isLoading: false,
  isDetailLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: null,
  detailError: null,
  submitError: null,

  getAllProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<ProjectsResponse>("/projects");
      set({ Project: response.data.projects, isLoading: false });
      return true;
    } catch (error) {
      const message = getAxiosErrorMessage(error, "Failed to fetch projects");
      toast.error(message);
      set({ error: message, isLoading: false });
      return false;
    }
  },

  getProjectById: async (id) => {
    set({ isDetailLoading: true, detailError: null, selectedProject: null });
    try {
      const response = await apiClient.get<ProjectResponse>(`/projects/${id}`);
      set({ selectedProject: response.data.project, isDetailLoading: false });
      return true;
    } catch (error) {
      const message = getAxiosErrorMessage(error, "Failed to fetch project");
      toast.error(message);
      set({ detailError: message, isDetailLoading: false });
      return false;
    }
  },

  createProject: async (data) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const validated = createProjectSchema.parse(data);
      const response = await apiClient.post<ProjectResponse>(
        "/projects",
        validated,
      );
      const project = response.data.project;
      set((state) => ({
        Project: [project, ...state.Project],
        isSubmitting: false,
      }));
      toast.success(
        getApiSuccessMessage(response.data, "Project created successfully"),
      );
      return true;
    } catch (err) {
      const message = getValidationError(err, "Failed to create project");
      toast.error(message);
      set({ submitError: message, isSubmitting: false });
      return false;
    }
  },

  updateProject: async (id, data) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const validated = updateProjectSchema.parse(data);
      const response = await apiClient.put<ProjectResponse>(
        `/projects/${id}`,
        validated,
      );
      const project = response.data.project;
      set((state) => ({
        Project: state.Project.map((p) => (p.id === id ? project : p)),
        selectedProject:
          state.selectedProject?.id === id ? project : state.selectedProject,
        isSubmitting: false,
      }));
      toast.success(
        getApiSuccessMessage(response.data, "Project updated successfully"),
      );
      return true;
    } catch (err) {
      const message = getValidationError(err, "Failed to update project");
      toast.error(message);
      set({ submitError: message, isSubmitting: false });
      return false;
    }
  },

  deleteProject: async (id) => {
    set({ isDeleting: true, error: null });
    try {
      const response = await apiClient.delete("/projects/" + id);
      set((state) => ({
        Project: state.Project.filter((p) => p.id !== id),
        selectedProject:
          state.selectedProject?.id === id ? null : state.selectedProject,
        isDeleting: false,
      }));
      toast.success(
        getApiSuccessMessage(response.data, "Project deleted successfully"),
      );
      return true;
    } catch (err) {
      const message = getAxiosErrorMessage(err, "Failed to delete project");
      toast.error(message);
      set({ error: message, isDeleting: false });
      return false;
    }
  },

  clearSelectedProject: () => {
    set({ selectedProject: null, detailError: null, isDetailLoading: false });
  },

  clearSubmitError: () => set({ submitError: null }),
}));

registerUnauthorizedHandler(() => {
  useProject.setState({
    Project: [],
    selectedProject: null,
    isLoading: false,
    isDetailLoading: false,
    isSubmitting: false,
    isDeleting: false,
    error: null,
    detailError: null,
    submitError: null,
  });
});
