const Tour = require("../models/post.model");
const debug = require("debug")("app:post-controller");
const controller = {};



controller.saveTour = async (req, res, next) => {


    try {
        const { title, description, image, duration, price, whaLink, mapLink } = req.body;
        const { identifier } = req.params;
        const { user } = req;



        let tour = await Tour.findById(identifier);

        if(!tour){
          tour= new Tour();
          tour["user"]=user._id;
        }else{
          if(!tour["user"].equals(user._id)){
            return res.status(403).json({error:"This is not your post tour"})
          }
        }

        tour["title"] = title;
        tour["description"] = description;
        tour["image"] = image;
        tour["duration"] = duration;
        tour["price"] = price;
        tour["whaLink"] = whaLink;
        tour["mapLink"] = mapLink;
    

        const tourSaved = await tour.save();
        if (!tourSaved) {
            return res.status(409).json({ error: "Error creating the tour" });
        }

        return res.status(201).json(tourSaved);
    } catch (error) {
        next(error);

    }


}

controller.findAllTours = async (req, res, next) => {
    try {
        const tour = await Tour.find({ hidden: false })
            .populate("user", "username email")
            .populate("comments.user", "username email");

        return res.status(200).json({ tour });
    } catch (error) {
        next(error);

    }
}

controller.finOneTourById = async (req, res, next) => {
    try {
        const { identifier } = req.params;

        const tour = await Tour.findOne({
            _id: identifier,
            hidden: false,
        })
            .populate("user", "username email _id")
            .populate("comments.user", "username email");


        if (!tour) {
            return res.status(404).json({ error: "Tour post not found" });
        }
        return res.status(200).json(tour);
    }
    catch (error) {
        next(error);


    }

}



controller.deleteTourByid = async (req, res, next) => {

try {
    const { identifier } = req.params;
    const user = req.user;

    const tour = await Tour.findOneAndDelete({
      _id: identifier,
      user: user._id,
    });

    if (!tour) {
      return res.status(404).json({ error: "Tour post not found" });
    }

    return res.status(200).json({ message: "Tour post deleted" });
  } catch (error) {
    next(error);
  }
}



controller.findByUserTour = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const tour = await tour.find({ user: identifier, hidden: false })
      .populate("user", "username email _id")
      .populate("comments.user", "username email");

    return res.status(200).json({ tour });
  } catch (error) {
    next(error);
  }
};

controller.findOwnTour = async (req, res, next) => {
  try {
    const { user } = req;

    const tour = await Tour.find({ user: user._id })
      .populate("user", "username email _id")
      .populate("comments.user", "username email");

    return res.status(200).json({ tour });
  } catch (error) {
    next(error);
  }
};


controller.findSavedTour = async (req, res, next) => {
  try {
    const user = await req.user.populate({
      path: "savedPostsTour",
      populate: [
        {
          path: "user",
          select: "username email",
        },
        
        {
          path: "comments.user",
          select: "username email",
        },
      ],
    });

    return res.status(200).json({ tour: user["savedPosts"] });
  } catch (error) {
    next(error);
  }
};



controller.toggleHiddenTour = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const user = req.user;

    //Obtener el post con el id
    //Verificar pertenencia del post al usuario
    const tour = await Tour.findOne({
      _id: identifier,
      user: user._id,
    })
      .populate("user", "username email ")
      .populate("comments.user", "username email");

    if (!tour) {
      return res.status(404).json({ error: "Tour Post not found" });
    }
    //Cambiar el valor
    tour.hidden = !tour.hidden;
    //Commit los cambios
    const newTour = await toure.save();
    //Cambio de post
    return res.status(200).json({ newTour });
  } catch (error) {
    next(error);
  }
};

controller.saveATour = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const user = req.user;

    const post = await Tour.findOne({
      _id: identifier,
      hidden: false,
    })
      .populate("user", "username email ")

    if (!post) {
      return res.status(404).json({ error: "Tour Post not found" });
    }

    let _posts = user["savedPostsTour"] || [];

    const alreadySaved = _posts.findIndex((_i) => _i && _i.equals(post._id)) >= 0;

    if (alreadySaved) {
      _posts = _posts.filter((_i) => _i && !_i.equals(post._id));
    } else {
      _posts = [post._id, ..._posts];
    }
    

    user["savedPosts"] = _posts;

    const newUser = await (
      await user.save()
    ).populate({
      path: "savedPosts",
      populate: [
        {
          path: "user",
          select: "username email",
        },
        {
          path: "comments.user",
          select: "username email",
        },
      ],
    });

    return res.status(200).json({ posts: newUser["savedPosts"] });
  } catch (error) {
    next(error);
  }
};




controller.saveCommentTour = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const { content,commentTour} = req.body;
    const user = req.user;

    //Obtener el post {id,hidden}
    const tour = await Tour.findOne({ _id: identifier, hidden: false })
      .populate("user", "username email")
    //Verificar que el post exista
    if (!tour) {
      return res.status(404).json({ error: "Tour Post not found" });
    }
    //Buscar la existencia de un comentario previo en base a commentId
    let _comments = tour["comments"];

    const prevIndex = _comments.findIndex((_c) => _c._id.equals(commentTour));

    if (prevIndex >= 0) {
      //Comentario ya existe
      const _comment = _comments[prevIndex];
      _comment.history = [..._comment.history, _comment.content];
      _comment.content = content;

      _comments[prevIndex] = _comment;
    } else {
      //Comentario no existe
      _comments = [
        ..._comments,
        { user: user._id, timestamp: new Date(), content },
      ];
    }

    //Guardar el post => commit
    tour["comments"] = _comments;

    const newTour = await (
      await tour.save()
    ).populate("comments.user", "username email");
    //Retornamos el post actualizado
    return res.status(200).json(newTour);
  } catch (error) {
    next(error);
  }
};


module.exports = controller;


