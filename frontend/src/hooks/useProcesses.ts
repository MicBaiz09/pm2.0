import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import type { BotProcess } from "@/types";

export const useProcesses = (serverId?: string) => {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: ["processes", serverId],
    queryFn: async () => {
      if (!serverId) return [];
      const { data } = await api.get<BotProcess[]>(`/servers/${serverId}/processes`);
      return data;
    },
    enabled: !!serverId
  });

  const mutate = (path: string) => async (processId: string) =>
    api.post(`/servers/${serverId}/processes/${processId}/${path}`);

  const start = useMutation({ mutationFn: mutate("start"), onSuccess: () => queryClient.invalidateQueries(["processes", serverId]) });
  const stop = useMutation({ mutationFn: mutate("stop"), onSuccess: () => queryClient.invalidateQueries(["processes", serverId]) });
  const restart = useMutation({ mutationFn: mutate("restart"), onSuccess: () => queryClient.invalidateQueries(["processes", serverId]) });

  return { list, start, stop, restart };
};
