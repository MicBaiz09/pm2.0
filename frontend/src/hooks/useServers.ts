import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import type { Server } from "@/types";

const KEY = ["servers"];

export const useServers = () => {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const { data } = await api.get<Server[]>("/servers");
      return data;
    }
  });

  const create = useMutation({
    mutationFn: (payload: Partial<Server>) => api.post("/servers", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY })
  });

  const update = useMutation({
    mutationFn: ({ id, ...payload }: Partial<Server> & { id: string }) =>
      api.put(`/servers/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY })
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/servers/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY })
  });

  return { list, create, update, remove };
};
