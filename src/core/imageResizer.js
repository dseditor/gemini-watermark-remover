/**
 * Image resizer utility
 * Handles resizing images to Gemini standard sizes and restoring to original dimensions
 */

/**
 * Determine if image needs resizing based on Gemini watermark standards
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {boolean} True if image needs resizing
 */
export function needsResizing(width, height) {
    // Gemini standard sizes: images > 1024x1024 use 96px watermark, otherwise 48px
    // We need to check if the image is close to these thresholds
    // If it's not a standard size, we should resize it

    // Check if image is too small (< 512) or has non-standard aspect ratio
    const minDimension = Math.min(width, height);
    const maxDimension = Math.max(width, height);

    // If image is very small, it might not have a watermark at standard position
    if (minDimension < 256) {
        return true;
    }

    // Check if dimensions are not multiples of common Gemini sizes
    // Gemini typically generates images at specific resolutions
    const commonSizes = [512, 768, 1024, 1536, 2048];
    const widthIsStandard = commonSizes.includes(width);
    const heightIsStandard = commonSizes.includes(height);

    // If neither dimension is standard, we should resize
    if (!widthIsStandard && !heightIsStandard) {
        return true;
    }

    return false;
}

/**
 * Calculate target size for processing
 * @param {number} width - Original width
 * @param {number} height - Original height
 * @returns {Object} Target dimensions {width, height}
 */
export function calculateTargetSize(width, height) {
    const aspectRatio = width / height;

    // Determine if we should use large (>1024) or small size
    const maxDimension = Math.max(width, height);

    if (maxDimension > 1024) {
        // Use 1536 as target for large images
        if (aspectRatio > 1) {
            // Landscape
            return { width: 1536, height: Math.round(1536 / aspectRatio) };
        } else {
            // Portrait or square
            return { width: Math.round(1536 * aspectRatio), height: 1536 };
        }
    } else {
        // Use 1024 as target for smaller images
        if (aspectRatio > 1) {
            // Landscape
            return { width: 1024, height: Math.round(1024 / aspectRatio) };
        } else {
            // Portrait or square
            return { width: Math.round(1024 * aspectRatio), height: 1024 };
        }
    }
}

/**
 * Resize image to target dimensions
 * @param {HTMLImageElement} image - Source image
 * @param {number} targetWidth - Target width
 * @param {number} targetHeight - Target height
 * @returns {HTMLCanvasElement} Resized canvas
 */
export function resizeImage(image, targetWidth, targetHeight) {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');

    // Use high-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw resized image
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    return canvas;
}

/**
 * Restore processed canvas to original dimensions
 * @param {HTMLCanvasElement} processedCanvas - Processed canvas at target size
 * @param {number} originalWidth - Original width
 * @param {number} originalHeight - Original height
 * @returns {HTMLCanvasElement} Canvas at original dimensions
 */
export function restoreOriginalSize(processedCanvas, originalWidth, originalHeight) {
    const canvas = document.createElement('canvas');
    canvas.width = originalWidth;
    canvas.height = originalHeight;

    const ctx = canvas.getContext('2d');

    // Use high-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw processed image back to original size
    ctx.drawImage(processedCanvas, 0, 0, originalWidth, originalHeight);

    return canvas;
}

/**
 * Process image with automatic resizing if needed
 * @param {HTMLImageElement} image - Source image
 * @param {Function} processFunction - Processing function that takes a canvas and returns a processed canvas
 * @returns {Promise<HTMLCanvasElement>} Processed canvas at original size
 */
export async function processWithResize(image, processFunction) {
    const originalWidth = image.width;
    const originalHeight = image.height;

    // Check if resizing is needed
    if (needsResizing(originalWidth, originalHeight)) {
        console.log(`[ImageResizer] 圖片尺寸 ${originalWidth}x${originalHeight} 非標準大小，將調整尺寸後處理`);

        // Calculate target size
        const targetSize = calculateTargetSize(originalWidth, originalHeight);
        console.log(`[ImageResizer] 目標尺寸: ${targetSize.width}x${targetSize.height}`);

        // Resize to target size
        const resizedCanvas = resizeImage(image, targetSize.width, targetSize.height);

        // Process at target size
        const processedCanvas = await processFunction(resizedCanvas);

        // Restore to original size
        console.log(`[ImageResizer] 還原至原始尺寸: ${originalWidth}x${originalHeight}`);
        const finalCanvas = restoreOriginalSize(processedCanvas, originalWidth, originalHeight);

        return finalCanvas;
    } else {
        console.log(`[ImageResizer] 圖片尺寸 ${originalWidth}x${originalHeight} 為標準大小，直接處理`);

        // Process directly without resizing
        return await processFunction(image);
    }
}
