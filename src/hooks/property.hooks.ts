import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  allProperties,
  type CreatePropertyPayload,
  createProperty,
  deleteProperty,
  getPropertyAmenities,
  myProperties,
  myPropertyDetails,
  type PropertyListParams,
  propertyDetails,
  type UpdatePropertyPayload,
  type UpdateRoomPayload,
  updateProperty,
  updatePropertyImage,
  updateRoom,
  updateRoomImage,
  uploadRoomImages,
} from "@/api/property.api";
import type { Property } from "@/types/property.type";

export function useAllProperties(params: PropertyListParams = {}) {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => allProperties(params),
    retry: 1,
  });
}

export const usePropertyDetails = (propertyId: string) => {
  return useQuery<Property, Error>({
    queryKey: ["property-details", propertyId],
    queryFn: () => {
      if (!propertyId) {
        throw new Error("Property ID is required");
      }

      return propertyDetails(propertyId);
    },
    enabled: Boolean(propertyId),
    retry: 1,
  });
};

export function usePropertyAmenities() {
  return useQuery({
    queryKey: ["property-amenities"],
    queryFn: getPropertyAmenities,
    retry: 1,
  });
}

export function useMyProperties(page = 1) {
  return useQuery({
    queryKey: ["properties", "mine", page],
    queryFn: () => myProperties(page),
    retry: 1,
  });
}

export function useMyPropertyDetails(propertyId: string) {
  return useQuery({
    queryKey: ["my-property-details", propertyId],
    queryFn: () => myPropertyDetails(propertyId),
    enabled: Boolean(propertyId),
    retry: 1,
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["properties"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard", "landlord"] }),
      ]);
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      propertyId,
      payload,
    }: {
      propertyId: string;
      payload: UpdatePropertyPayload;
    }) => updateProperty(propertyId, payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["properties"] }),
        queryClient.invalidateQueries({
          queryKey: ["property-details", variables.propertyId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["my-property-details", variables.propertyId],
        }),
      ]);
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      propertyId,
      roomId,
      payload,
    }: {
      propertyId: string;
      roomId: string;
      payload: UpdateRoomPayload;
    }) => updateRoom(propertyId, roomId, payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["property-details", variables.propertyId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["my-property-details", variables.propertyId],
      });
    },
  });
}

export function useUploadRoomImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      propertyId,
      roomId,
      images,
    }: {
      propertyId: string;
      roomId: string;
      images: File[];
    }) => uploadRoomImages(propertyId, roomId, images),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["property-details", variables.propertyId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["my-property-details", variables.propertyId],
      });
    },
  });
}

export function useUpdateRoomImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      propertyId,
      roomId,
      roomImageId,
      image,
    }: {
      propertyId: string;
      roomId: string;
      roomImageId: string;
      image: File;
    }) => updateRoomImage(propertyId, roomId, roomImageId, image),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["property-details", variables.propertyId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["my-property-details", variables.propertyId],
      });
    },
  });
}

export function useUpdatePropertyImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      propertyId,
      propertyImageId,
      image,
    }: {
      propertyId: string;
      propertyImageId: string;
      image: File;
    }) => updatePropertyImage(propertyId, propertyImageId, image),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["property-details", variables.propertyId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["my-property-details", variables.propertyId],
      });
    },
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      images,
    }: {
      payload: CreatePropertyPayload;
      images: File[];
    }) => createProperty(payload, images),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      await queryClient.invalidateQueries({
        queryKey: ["dashboard", "landlord"],
      });
    },
  });
}
