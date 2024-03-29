/* eslint-disable */
import { useState } from 'react';
import { useGetIdentity } from '@pankod/refine-core';
import { FieldValues, useForm } from '@pankod/refine-react-hook-form';
import Form from 'components/common/Form';
import { useNavigate } from '@pankod/refine-react-router-v6';

const CreateProperty = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity();
  const [propertyImage, setPropertyImage] = useState({ name: '', url: '' });
  const { refineCore: { onFinish, formLoading }, register, handleSubmit } = useForm();
  const [selectedLanguage, setSelectedLanguage] = useState("both");

  const handleImageChange = (file: File) => {
    const reader = (readFile: File) => new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.readAsDataURL(readFile);
    });

    reader(file).then((result: string) => setPropertyImage({ name: file?.name, url: result }));
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  }

  const onFinishHandler = async (data: FieldValues) => {
    if (!propertyImage.name) return alert('Please upload a property image');

    await onFinish({ ...data, arabicText: data.arabicText ? data.arabicText : "", englishText: data.englishText ? data.englishText : "", photo: propertyImage.url, email: user.email, language: selectedLanguage });

    navigate('/properties');
  };

  return (
    <Form
      type="Create"
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      handleLanguageChange={handleLanguageChange}
      onFinishHandler={onFinishHandler}
      propertyImage={propertyImage}
    />
  );
};

export default CreateProperty;
