import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const toast = MySwal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export const showSuccessToast = (message = 'Operation completed successfully!') => {
  toast.fire({
    icon: 'success',
    title: message,
  });
};

export const showErrorToast = (message = 'Something went wrong!') => {
  toast.fire({
    icon: 'error',
    title: message,
  });
};

export const showConfirmationDialog = (
  title = 'هل أنت متأكد؟',
  text = 'لا يمكن التراجع عن هذا الإجراء!'
): Promise<boolean> => {
  return MySwal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'نعم، قم بالتنفيذ!',
    cancelButtonText: 'إلغاء',
    customClass: {
      popup: 'rounded-lg',
      confirmButton: 'btn btn-danger',
      cancelButton: 'btn btn-outline ml-2',
    },
    buttonsStyling: false,
  }).then((result) => {
    return result.isConfirmed;
  });
};
