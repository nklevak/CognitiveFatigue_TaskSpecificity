from PIL import Image, ImageChops
import numpy as np

# At 30 fps, the number of frames in 0.90 seconds is 0.90 × 30 = 27 $ previously 29
def interpolate_images(imageA, imageB, steps=27):
    """Generate a list of images interpolating between imageA and imageB."""
    frames = []
    for step in range(steps):
        t = step / (steps - 1)
        interpolated_image = ImageChops.blend(imageA, imageB, t)
        frames.append(interpolated_image)
    return frames

def load_and_resize_images(pathA, pathB):
    large_path = "./stimuli/initial_esterman_w/"
    A_path = large_path + pathA
    B_path = large_path + pathB

    imageA = Image.open(A_path).convert('L')
    imageB = Image.open(B_path).convert('L')
    
    # used to be 100 by 150
    target_width=230
    target_height= 230
    
    # Resize both images
    resizedA = imageA.resize((target_width, target_height), Image.Resampling.LANCZOS)
    resizedB = imageB.resize((target_width, target_height), Image.Resampling.LANCZOS)

    # Save the resized images
    save_path = "./stimuli/initial_esterman_w/resized/"
    resizedA.save(save_path + pathA)
    resizedB.save(save_path + pathB)
    
    return resizedA, resizedB

# to manually do this for preselected images: 
# imageA, imageB = load_and_resize_images('mountain_1.jpg','city_8.jpg')
# # Interpolate between the two images
# frames = interpolate_images(imageA, imageB)
# # Save the frames as a GIF
# frames[0].save('./stimuli/final_gifs/m1_city8.gif', save_all=True, append_images=frames[1:], duration=800/len(frames), loop=0)

# to loop through all of my images and do this for each pair:
# the same image cannot happen consecutively, so just need to find all individual combinations 
image_list = []
for i in range(1,11):
    image_list.append(f'city_{i}')
image_list.append('white_1') # white background that we can transition from in the first trial and transition to in the last trial
image_list.append('mountain_1')

save_path = './stimuli/final_gifs_900_e_w_big/'
for image_a in image_list:
    image_a_fname = image_a.split('_')
    export_a = save_path
    if (image_a_fname[0]=="city"):
        export_a = export_a + "c" + image_a_fname[1] + "_"
    elif (image_a_fname[0]=="white"):
        export_a = export_a + "white" + image_a_fname[1] + "_"
    else:
        export_a = export_a + "m" + image_a_fname[1] + "_"
    
    for image_b in image_list:
        export = export_a
        if(image_a==image_b):
            continue
        image_b_fname = image_b.split('_')
        if (image_b_fname[0]=="city"):
            export = export + "c" + image_b_fname[1] + ".gif"
        elif(image_b_fname[0]=="white"):
            export = export + "white1.gif"
        else:
            export = export + "m" + image_b_fname[1] + ".gif"
        
        fn_image_a = image_a + ".jpg"
        fn_image_b = image_b + ".jpg"
        imageA, imageB = load_and_resize_images(fn_image_a,fn_image_b)
        frames = interpolate_images(imageA, imageB)
        frames[0].save(export, save_all=True, append_images=frames[1:], duration=900/len(frames), loop=0)