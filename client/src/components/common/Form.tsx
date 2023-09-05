/* eslint-disable */
import { Box, Typography, FormControl, FormHelperText, TextField, TextareaAutosize, Stack, Select, MenuItem, Button } from '@pankod/refine-mui';

import { FormProps } from 'interfaces/common';
import CustomButton from './CustomButton';
import { useState } from 'react';

const Form = ({ type, register, handleSubmit, handleImageChange, formLoading, handleLanguageChange, onFinishHandler, propertyImage }: FormProps) => {
  const [language, setLanguage] = useState("both");

  const handleSelectedLanguageChange = (e: any) => {
    setLanguage(e.target.value);
    handleLanguageChange(e.target.value);
  }

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142D">{type} a Blog</Typography>

      <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor="#FCFCFC">
        <form
          style={{ marginTop: '20px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}
          onSubmit={handleSubmit(onFinishHandler)}
        >
          <FormControl>
            <FormHelperText sx={{ fontWeight: 500, margin: '10px 0', fontSize: 16, color: '#11142D' }}>Enter blog name</FormHelperText>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register('title', { required: true })}
            />
          </FormControl>

          <FormControl>
            <FormHelperText sx={{ fontWeight: 500, margin: '10px 0', fontSize: 16, color: '#11142D' }}>Select Language</FormHelperText>
            <Select
              variant="outlined"
              color="info"
              required
              value={language}
              onChange={handleSelectedLanguageChange}
              // {...register('language', { required: true })}
            >
              <MenuItem value="english">English</MenuItem>
              <MenuItem value="arabic">Arabic</MenuItem>
              <MenuItem value="both">Both</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <FormHelperText sx={{ fontWeight: 500, margin: '10px 0', fontSize: 16, color: '#11142D' }}>Blog English Content</FormHelperText>
            <TextareaAutosize
              disable={language === "arabic"}
              minRows={5}
              required
              placeholder="Write blog content"
              color="info"
              style={{ width: '100%', background: 'transparent', fontSize: '16px', borderColor: 'rgba(0, 0, 0, 0.23)', borderRadius: 6, padding: 10, color: '#919191' }}
              {...register('englishText', { required: false, default: "" })}
            />
          </FormControl>
          
          <FormControl>
            <FormHelperText sx={{ fontWeight: 500, margin: '10px 0', fontSize: 16, color: '#11142D' }}>Blog Arabic Content</FormHelperText>
            <TextareaAutosize
              disabled={language === "english"}
              minRows={5}
              required
              placeholder="Write blog content"
              color="info"
              style={{ width: '100%', background: 'transparent', fontSize: '16px', borderColor: 'rgba(0, 0, 0, 0.23)', borderRadius: 6, padding: 10, color: '#919191' }}
              {...register('arabicText', { required: false, default: "" })}
            />
          </FormControl>

          <Stack direction="row" gap={4}>
            {/* <FormControl sx={{ flex: 1 }}>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: '10px 0',
                  fontSize: 16,
                  color: '#11142D',
                }}
              >
                Enter property type
              </FormHelperText>
              <Select
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ 'aria-label': 'Without label' }}
                defaultValue="apartment"
                {...register('propertyType', { required: true })}
              >
                <MenuItem value="apartment">Apartment</MenuItem>
                <MenuItem value="villa">Villa</MenuItem>
                <MenuItem value="farmhouse">Farmhouse</MenuItem>
                <MenuItem value="condos">Condos</MenuItem>
                <MenuItem value="townhouse">Townhouse</MenuItem>
                <MenuItem value="duplex">Duplex</MenuItem>
                <MenuItem value="studio">Studio</MenuItem>
                <MenuItem value="chalet">Chalet</MenuItem>
              </Select>
            </FormControl> */}

            <FormControl sx={{ flex: 1 }}>
              <FormHelperText sx={{ fontWeight: 500, margin: '10px 0', fontSize: 16, color: '#11142D' }}>Enter blog read time</FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                variant="outlined"
                color="info"
                type="number"
                {...register('readTime', { required: true })}
              />
            </FormControl>
          </Stack>

          <FormControl>
            <FormHelperText sx={{ fontWeight: 500, margin: '10px 0', fontSize: 16, color: '#11142D' }}>Enter keywords (seperated by a comma)</FormHelperText>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              variant="outlined"
              color="info"
              {...register('keywords', { required: true })}
            />
          </FormControl>

          <Stack direction="column" gap={1} justifyContent="center" mb={2}>
            {/* <FormControl>
              <FormHelperText sx={{ fontWeight: 500, margin: '10px 0', fontSize: 16, color: '#11142D' }}>Enter blog photo url</FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                variant="outlined"
                {...register('photo', { required: true })}
              />
            </FormControl> */}

            <Stack
                          direction="column"
                          gap={1}
                          justifyContent="center"
                          mb={2}
                      >
                          <Stack direction="row" gap={2}>
                              <Typography
                                  color="#11142d"
                                  fontSize={16}
                                  fontWeight={500}
                                  my="10px"
                              >
                                  Property Photo
                              </Typography>

                              <Button
                                  component="label"
                                  sx={{
                                      width: "fit-content",
                                      color: "#2ed480",
                                      textTransform: "capitalize",
                                      fontSize: 16,
                                  }}
                              >
                                  Upload *
                                  <input
                                      hidden
                                      accept="image/*"
                                      type="file"
                                      onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>,
                                      ) => {
                                          handleImageChange(e.target.files![0]);
                                      }}
                                  />
                              </Button>
                          </Stack>
                          <Typography
                              fontSize={14}
                              color="#808191"
                              sx={{ wordBreak: "break-all" }}
                          >
                              {propertyImage?.name}
                          </Typography>
                      </Stack>
          </Stack>

          <CustomButton
            type="submit"
            title={formLoading ? 'Submitting...' : 'Submit'}
            backgroundColor="#475BE8"
            color="#FCFCFC"
          />
        </form>
      </Box>
    </Box>
  )
};

export default Form;
