import * as Yup from 'yup';

const FormSchema = Yup.object().shape({


    input: Yup.string()
    .min(2, 'Search Input Must Have At Least 2 Characters')
    .max(255, 'Question Must Be Less Than 255 Characters')
    .required('Search Input Required'),
    
});

export default FormSchema;