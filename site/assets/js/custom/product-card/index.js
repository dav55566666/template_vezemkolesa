let catalogItemAlbum = {
    album: [],

    emptyItem: {
        image: '',
        thumb: ''
    },

    active: 0,

    setAlbum(album)
    {
        album = album || [];

        this.album = album;
    },

    getAlbum()
    {
        return this.album;
    },

    getAlbumItem(index)
    {
        index = index || 0;

        let album = this.getAlbum();

        if (   (typeof album == 'object')
            && (Array.isArray(album))
        ) {
            let item = album[index];

            if (typeof item == "object") {
                return item;
            } else {
                return this.emptyItem;
            }
        }

        return this.emptyItem;
    },

    getActive()
    {
        return this.active;
    },

    setActive(index)
    {
        this.active = index;
    }
};


let AlbumManager = {
    album: undefined,

    setActive(index)
    {
        let album = AlbumManager.getAlbum();

        let activeIndex = album.getActive();

        let activeItem = album.getAlbumItem(activeIndex);

        let activeImage = activeItem.thumb;

        let imageArray = document.querySelectorAll('.image-href')

        let imageHref = document.querySelectorAll('.image-href')[activeIndex];

        imageArray.forEach(item=>{
            item.classList.add('hidden');
        });

        imageHref.classList.remove('hidden');
    },

    setAlbum(album)
    {
        this.album = album;
    },

    getAlbum()
    {
        return this.album;
    },

    init(album)
    {
        this.setAlbum(album);

        let collection = document.querySelectorAll('.img-container');

        collection.forEach(item => {
            item.addEventListener('click', function(e){
                AlbumManager.setImage(Array.prototype.indexOf.call(item.parentNode.children, item));

                // document.querySelectorAll('.img-container')
                document.querySelectorAll('.img-container').forEach(elem => {
                    elem.classList.remove('active');
                })

                item.classList.add('active');
            });
        });
    },

    setImage(index)
    {
        let album = this.getAlbum();

        if (index == album.getActive()) return false;

        album.setActive(index);

        this.setAlbum(album);

        this.setActive(index);

        return true;
    }
}
