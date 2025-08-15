import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/admin/api/projects';
import { getTestimonials } from '@/admin/api/testimonials';
import { getContent } from '@/admin/api/content';
import { getCategories, getProjectCategories } from '@/admin/api/categories';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: getTestimonials,
    staleTime: 5 * 60 * 1000,
  });
};

export const useServices = () => {
  return useQuery({
    queryKey: ['services-content'],
    queryFn: () => getContent('services'),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAbout = () => {
  return useQuery({
    queryKey: ['about-content'],
    queryFn: () => getContent('about'),
    staleTime: 5 * 60 * 1000,
  });
};

export const useContact = () => {
  return useQuery({
    queryKey: ['contact-content'],
    queryFn: () => getContent('contact'),
    staleTime: 5 * 60 * 1000,
  });
};

export const useHero = () => {
  return useQuery({
    queryKey: ['hero-content'],
    queryFn: () => getContent('hero'),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProjectCategories = () => {
  return useQuery({
    queryKey: ['project-categories'],
    queryFn: getProjectCategories,
    staleTime: 5 * 60 * 1000,
  });
};
