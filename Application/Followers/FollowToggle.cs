using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await context.Users.FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUsername());

                var target = await context.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);

                if (target == null) return null;

                var following = await context.UserFollowings.FindAsync(observer?.Id, target.Id);

                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };

                    context.UserFollowings.Add(following);
                }
                else
                {
                    context.UserFollowings.Remove(following);
                }

                var success = await context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to update following");
            }
        }
    }
}