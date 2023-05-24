import * as Yup from 'yup';

const FormSchema = Yup.object().shape({


    question: Yup.string()
    .min(2, 'Question Must Have At Least 2 Characters')
    .max(255, 'Question Must Be Less Than 255 Characters')
    .required('Question is Required'),

    answer: Yup.string()
        .min(10, 'Answer Must Have At Least 2 Characters')
        .max(2000, 'Answer Must Be Less Than 255 Characters')
        .required('Answer is Required'),

    categoryId: Yup.number()
    .min(1, "Category Id must have atleast 1 option")
    .required('Category is Required'),

    
});

export default FormSchema;