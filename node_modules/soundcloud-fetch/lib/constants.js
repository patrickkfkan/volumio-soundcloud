const API_BASE_URL = 'https://api-v2.soundcloud.com';

const ARTWORK_FORMATS = ['t500x500', 'crop', 't300x300', 'large', 't67x67', 'badge', 'small', 'tiny', 'mini'];

const ARTWORK_FORMAT_SIZES = {
    't500x500': '500x500',
    'crop': '400x400',
    't300x300': '300x300',
    'large': '100x100',
    't67x67': '67x67',
    'badge': '47x47',
    'small': '32x32',
    'tiny': '20x20',
    'mini': '16x16'
}

const AVATAR_FORMATS = ['t500x500', 'crop', 't300x300', 'large', 'badge', 'small', 'tiny', 'mini'];

const AVATAR_FORMAT_SIZES = {
    't500x500': '500x500',
    'crop': '400x400',
    't300x300': '300x300',
    'large': '100x100',
    'badge': '47x47',
    'small': '32x32',
    'tiny': '18x18',
    'mini': '16x16'
}

const QUERY_MAX_LIMIT = 50;

module.exports = {
    API_BASE_URL,
    ARTWORK_FORMATS, 
    ARTWORK_FORMAT_SIZES, 
    AVATAR_FORMATS, 
    AVATAR_FORMAT_SIZES, 
    QUERY_MAX_LIMIT
};