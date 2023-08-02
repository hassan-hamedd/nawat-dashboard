/* eslint-disable */
import { Box, Typography, FormControl, FormHelperText, TextField, TextareaAutosize, Stack, Select, MenuItem, Button } from '@pankod/refine-mui';

import { FormProps } from 'interfaces/common';
import CustomButton from './CustomButton';

const Form = ({ type, register, handleSubmit, handleImageChange, formLoading, onFinishHandler, propertyImage }: FormProps) => (
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
          <FormHelperText sx={{ fontWeight: 500, margin: '10px 0', fontSize: 16, color: '#11142D' }}>Blog Description</FormHelperText>
          <TextareaAutosize
            minRows={5}
            required
            placeholder="Write blog content"
            color="info"
            style={{ width: '100%', background: 'transparent', fontSize: '16px', borderColor: 'rgba(0, 0, 0, 0.23)', borderRadius: 6, padding: 10, color: '#919191' }}
            {...register('description', { required: true })}
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
              {...register('price', { required: true })}
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
            {...register('location', { required: true })}
          />
        </FormControl>

        <Stack direction="column" gap={1} justifyContent="center" mb={2}>
        <FormControl>
          <FormHelperText sx={{ fontWeight: 500, margin: '10px 0', fontSize: 16, color: '#11142D' }}>Enter blog photo url</FormHelperText>
          <TextField
            fullWidth
            required
            id="outlined-basic"
            color="info"
            variant="outlined"
            {...register('photo', { required: true })}
          />
        </FormControl>
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
);

export default Form;
